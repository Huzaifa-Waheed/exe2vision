import { useState, useRef } from "react";
import { Upload, Info, CheckCircle, AlertCircle, Play } from "lucide-react";
import HeaderLogin from "../components/HeaderAfterLogin";
import { useNavigate } from "react-router-dom";
import { uploadAsmScan } from "../api";

const AsmScanner = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const validateAsm = (f) => f.name.toLowerCase().endsWith(".asm");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const f = e.target.files[0];
      if (validateAsm(f)) { setFile(f); setError(""); }
      else { setError("Only Assembly (.asm) files are allowed."); setFile(null); }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0];
      if (validateAsm(f)) { setFile(f); setError(""); }
      else { setError("Only Assembly (.asm) files are allowed."); setFile(null); }
    }
  };

  const handleScan = () => {
    if (!file) return;
    navigate("/progress", { state: { fileName: file.name, file, isAsm: true } });
  };

  return (
    <div className="flex flex-col items-center pt-24 px-4 md:px-6 lg:px-10 min-h-screen bg-[#0A1324]">
      <h1 className="text-white text-3xl md:text-4xl font-semibold mb-4 text-center">
        Assembly File Scanner
      </h1>
      <p className="text-gray-400 text-base md:text-lg mb-12 text-center max-w-3xl">
        Upload an assembly (.asm) file to analyze it directly using our AI-powered system — no disassembly step needed
      </p>

      <div
        className="w-full max-w-4xl border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center p-10 md:p-14 mb-6 hover:border-[#14C9E7] transition bg-[#111C33] min-h-[300px]"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="text-[#14C9E7] mb-6" size={50} />

        {!file && (
          <p className="text-gray-400 mb-4 text-lg md:text-xl text-center">
            Drag and drop your .asm file here
          </p>
        )}
        {file && (
          <p className="text-[#14C9E7] mb-4 text-lg md:text-xl text-center break-all">
            Selected file: {file.name}
          </p>
        )}

        <p className="text-gray-500 mb-4 text-center">or</p>

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-[#14C9E7] hover:bg-[#11b5d1] text-white font-medium py-3 px-8 rounded-xl text-lg mb-3 transition cursor-pointer"
        >
          Browse Files
        </button>

        <p className="text-[#14C9E7] font-semibold mt-3 text-sm md:text-base text-center border-t border-[#14C9E7] pt-2 w-full">
          Supported format: Assembly File (.asm)
        </p>

        <input type="file" accept=".asm" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        {error && (
          <div className="flex items-center mt-4 text-red-500 text-sm md:text-base">
            <AlertCircle size={18} className="mr-2" /> {error}
          </div>
        )}
      </div>

      <button
        disabled={!file}
        onClick={handleScan}
        className={`w-full max-w-4xl flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-xl transition ${
          file ? "bg-[#14C9E7] hover:bg-[#11b5d1] cursor-pointer" : "bg-gray-600 cursor-not-allowed"
        } mb-12`}
      >
        <Play size={20} /> Scan ASM File
      </button>

      <div className="w-full max-w-4xl bg-[#111C33] rounded-2xl p-8 md:p-12 shadow-lg text-gray-300 space-y-10">
        <div>
          <div className="flex items-center mb-6">
            <Info className="text-[#14C9E7] mr-3" size={24} />
            <h3 className="text-white font-semibold text-lg md:text-xl">How ASM Scan Works</h3>
          </div>
          <ol className="space-y-6">
            {[
              { title: "Select Your ASM File", desc: "Choose an assembly (.asm) file from your computer. Drag and drop or use the Browse button." },
              { title: "Start the Scan", desc: "Click 'Scan ASM File' to begin. The assembly text is read directly — no disassembly needed." },
              { title: "RGB Image Generation", desc: "N-gram patterns are extracted from the assembly instructions and converted into an RGB image." },
              { title: "AI Classification", desc: "Our deep learning model analyzes the image and classifies the file as Benign or Malware with a confidence score." },
            ].map((step, idx) => (
              <li key={idx} className="flex items-start space-x-4">
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#14C9E7] text-white font-semibold rounded-full flex items-center justify-center">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm md:text-base">{step.title}</h4>
                  <p className="text-gray-300 text-sm md:text-base">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-[#0D101F] rounded-xl p-6 shadow-inner">
          <div className="flex items-start space-x-4">
            <CheckCircle className="text-[#14C9E7] mt-1" size={28} />
            <div>
              <h4 className="text-white font-semibold mb-2 text-lg md:text-xl">Security & Privacy</h4>
              <p className="text-gray-300 text-sm md:text-base">
                All uploaded files are analyzed in a secure, isolated environment and are not stored permanently on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ScanAsmComponent() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      <HeaderLogin />
      <AsmScanner />
    </div>
  );
}
