import os
import numpy as np
import pandas as pd
import cv2

# ============================
# --- CONFIG ---
# ============================
MAPPING_DIR = os.getenv("NGRAMS_DIR", "NGRAM_Files_Colored")
OUTPUT_DIR = os.getenv("NGRAMS_OUTPUT_DIR", "./output_images")
WIDTH = int(os.getenv("NGRAM_IMAGE_WIDTH", "825"))
SLOTS_PER_LINE = int(os.getenv("NGRAM_SLOTS_PER_LINE", "17"))
DEFAULT_GRAY = (180, 180, 180)
FALLBACK_BLACK = (0, 0, 0)

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================
# --- Globals ---
# ============================
used_colors = set()
assigned_colors = {}
all_random_ngrams = {}


# ============================
# --- Tokenization ---
# ============================
def clean_and_tokenize_line(line: str):
    line = line.strip()
    if not line or line.startswith(";") or line.endswith(":") or line.startswith("."):
        return []
    return line.replace(",", " ").split()


def tokenize_asm_text(asm_text: str):
    """Tokenize assembly text string (used when asm comes from disassembly or file read)."""
    tokenized = []
    for line in asm_text.splitlines():
        tokens = clean_and_tokenize_line(line)
        if tokens:
            tokenized.append(tokens)
    return tokenized


# ============================
# --- N-grams ---
# ============================
def extract_ngrams(tokens, n):
    if len(tokens) < n:
        return [' '.join(tokens)]
    return [' '.join(tokens[i:i+n]) for i in range(len(tokens)-n+1)]


# ============================
# --- Load mappings ---
# ============================
def load_all_mappings(ngram_type: str):
    color_map = {}
    try:
        for file in os.listdir(MAPPING_DIR):
            if not file.startswith(ngram_type):
                continue
            if not (file.endswith(".xlsx") or file.endswith(".csv")):
                continue

            path = os.path.join(MAPPING_DIR, file)
            try:
                df = pd.read_excel(path) if file.endswith(".xlsx") else pd.read_csv(path)
                for _, row in df.iterrows():
                    ng = str(row.iloc[0]).strip()
                    # Handle both rgb(R,G,B) format and plain (R,G,B) format
                    rgb_str = str(row.iloc[1]).strip()
                    rgb_str = rgb_str.replace("rgb(", "").replace(")", "").strip("() ")
                    try:
                        rgb = tuple(int(x) for x in rgb_str.split(","))
                    except ValueError:
                        continue
                    if len(rgb) == 3:
                        color_map.setdefault(ng, rgb)
                        used_colors.add(rgb)
            except Exception:
                continue
    except FileNotFoundError:
        pass

    return color_map


# ============================
# --- Random color generator ---
# ============================
def generate_random_unique_color():
    for _ in range(100_000):
        color = tuple(np.random.randint(0, 256, 3).tolist())
        if color not in used_colors:
            used_colors.add(color)
            return color
    return FALLBACK_BLACK


# ============================
# --- Image generation ---
# ============================
def generate_image(tokenized_lines, ngram_map, ngram_size):
    TOTAL_PIXELS = WIDTH * WIDTH
    pixels = np.zeros((TOTAL_PIXELS, 3), dtype=np.uint8)
    pixels[:] = DEFAULT_GRAY
    used_colors.add(DEFAULT_GRAY)

    idx = 0
    for tokens in tokenized_lines:
        ngrams = extract_ngrams(tokens, ngram_size)
        ngrams = ngrams[:SLOTS_PER_LINE]

        for ng in ngrams:
            if idx >= TOTAL_PIXELS:
                break

            if ng in ngram_map:
                color = ngram_map[ng]
            elif ng in assigned_colors:
                color = assigned_colors[ng]
            else:
                color = generate_random_unique_color()
                assigned_colors[ng] = color
                if ng not in all_random_ngrams:
                    all_random_ngrams[ng] = color

            pixels[idx] = np.array(color, dtype=np.uint8)
            idx += 1

        idx += (SLOTS_PER_LINE - len(ngrams))

    return pixels.reshape((WIDTH, WIDTH, 3))


# ============================
# --- Save random ngrams CSV ---
# ============================
def _save_random_ngrams_csv():
    """Append any newly discovered random ngrams to bigram_random_ngrams.csv."""
    if not all_random_ngrams:
        return
    csv_rows = [
        {"ngram": ng, "random_color": f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"}
        for ng, rgb in all_random_ngrams.items()
    ]
    df = pd.DataFrame(csv_rows)
    csv_path = os.path.join(MAPPING_DIR, "bigram_random_ngrams.csv")
    try:
        if os.path.exists(csv_path):
            df.to_csv(csv_path, mode='a', header=False, index=False)
        else:
            df.to_csv(csv_path, mode='w', header=True, index=False)
    except Exception as e:
        import logging
        logging.warning("Could not save random ngrams CSV: %s", e)


# ============================
# --- Public API (called by ml_model.py) ---
# ============================
def generate_image_from_asm_text(asm_text: str, ngram: int = 2, save_output: bool = False):
    """
    Accept assembly text string, generate and return an RGB numpy array.
    This is the entry point called by MLModel.convert_to_rgb().

    asm_text   : raw assembly code as a string
    ngram      : 1 (unigram), 2 (bigram), 3 (trigram)
    save_output: if True, also writes the image to OUTPUT_DIR as a PNG
    """
    global used_colors, assigned_colors, all_random_ngrams
    used_colors.clear()
    assigned_colors.clear()
    all_random_ngrams.clear()

    if ngram not in (1, 2, 3):
        raise ValueError("ngram must be 1, 2, or 3")

    tokenized_lines = tokenize_asm_text(asm_text)
    if not tokenized_lines:
        raise RuntimeError("Assembly text is empty or invalid")

    ngram_name = {1: "unigram", 2: "bigram", 3: "trigram"}[ngram]
    ngram_map = load_all_mappings(ngram_name)

    rgb_img = generate_image(tokenized_lines, ngram_map, ngram)

    # Always persist newly discovered random ngrams
    _save_random_ngrams_csv()

    if save_output:
        bgr_img = cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR)
        out_path = os.path.join(OUTPUT_DIR, "asm_image.png")
        cv2.imwrite(out_path, bgr_img)

    return rgb_img
