import os
import re
import logging
import pefile
from capstone import (
    Cs,
    CS_ARCH_X86,
    CS_MODE_64,
    CS_MODE_32,
    CS_ARCH_ARM,
    CS_MODE_ARM,
    CS_ARCH_ARM64,
)


def _clean_operand(op_str: str) -> str:
    """Normalize whitespace in Capstone operand string."""
    if not op_str:
        return ""
    return re.sub(r"\s+", " ", op_str).strip()


def _generate_label(addr: int, entry_point: int) -> str:
    """Generate IDA-like label for a target address."""
    if addr == entry_point:
        return f"sub_{addr:08X}"
    return f"loc_{addr:08X}"


def disassemble_exe(file_path: str) -> str:
    """
    Disassemble a PE executable using pefile and Capstone.

    Accepts the path to an uploaded .exe file (saved by FileManager),
    disassembles all executable sections, and returns the full assembly
    text as a string. This string is then passed directly to
    asm_to_image.generate_image_from_asm_text() by MLModel.convert_to_rgb().

    Returns an assembly text string.
    Raises RuntimeError on invalid PE or unsupported architecture.
    """
    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        if not file_bytes.startswith(b"MZ"):
            logging.error("File is not a valid PE: %s", file_path)
            raise RuntimeError("Not a valid PE file")

        pe = pefile.PE(data=file_bytes)

        machine_map = {
            0x8664: (CS_ARCH_X86, CS_MODE_64),
            0x14c:  (CS_ARCH_X86, CS_MODE_32),
            0x1c0:  (CS_ARCH_ARM, CS_MODE_ARM),
            0xaa64: (CS_ARCH_ARM64, CS_MODE_ARM),
        }

        machine = pe.FILE_HEADER.Machine
        if machine not in machine_map:
            logging.error("Unsupported architecture 0x%02x for file %s", machine, file_path)
            raise RuntimeError(f"Unsupported architecture: 0x{machine:x}")

        cs_arch, cs_mode = machine_map[machine]
        md = Cs(cs_arch, cs_mode)

        entry_point = pe.OPTIONAL_HEADER.AddressOfEntryPoint

        asm_lines = []

        for section in pe.sections:
            # IMAGE_SCN_MEM_EXECUTE = 0x20000000
            if not section.Characteristics & 0x20000000:
                continue

            section_name = section.Name.decode(errors="ignore").strip("\x00")
            asm_lines.append(f"\n; Section: {section_name}\n")

            section_data = section.get_data()
            if not section_data:
                continue

            try:
                for instr in md.disasm(section_data, section.VirtualAddress):
                    mnemonic = instr.mnemonic
                    op_str = _clean_operand(instr.op_str)

                    # Replace raw hex addresses in call/jmp with IDA-like labels
                    if mnemonic.startswith("j") or mnemonic == "call":
                        match = re.search(r"0x[0-9a-fA-F]+", instr.op_str)
                        if match:
                            try:
                                target = int(match.group(), 16)
                                op_str = _generate_label(target, entry_point)
                            except ValueError:
                                pass

                    asm_lines.append(f"{mnemonic} {op_str}" if op_str else mnemonic)

            except Exception:
                logging.exception(
                    "Error disassembling section %s of %s", section.Name, file_path
                )
                continue

        return "\n".join(asm_lines)

    except pefile.PEFormatError as e:
        logging.exception("PE parsing failed for %s: %s", file_path, e)
        raise RuntimeError("Invalid PE file") from e
    except Exception as e:
        logging.exception("Disassembly failed for %s: %s", file_path, e)
        raise
