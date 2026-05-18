import React, { useEffect, useState } from "react";
import HeaderLogin from "../components/HeaderAfterLogin";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadScan } from "../api";

const FileAnalysisProgress = () => {
  const steps = [
    "Processing file...",
    "Disassembling assembly...",
    "Generating n-gram RGB images...",
    "Running AI analysis...",
  ];

  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = location.state?.fileName || "File.exe";
  const file = location.state?.file;

  useEffect(() => {
    let scanResult = null;

    // Start the real API call immediately
    if (file) {
      uploadScan(file)
        .then((res) => { scanResult = res.data.scan_result; })
        .catch((err) => {
          setError(err.response?.data?.detail || "Scan failed");
        });
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next <= 25) setStepIndex(0);
        else if (next <= 50) setStepIndex(1);
        else if (next <= 75) setStepIndex(2);
        else setStepIndex(3);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (scanResult) {
              navigate("/result", {
                state: {
                  fileName: scanResult.filename || fileName,
                  status: scanResult.result,
                  confidence: `${(scanResult.probability * 100).toFixed(2)}%`,
                  date: scanResult.scanned_at
                    ? new Date(scanResult.scanned_at).toLocaleString()
                    : new Date().toLocaleString(),
                  scanId: scanResult.id,
                },
              });
            } else if (!error) {
              // API still in flight — wait a bit more
              const wait = setInterval(() => {
                if (scanResult) {
                  clearInterval(wait);
                  navigate("/result", {
                    state: {
                      fileName: scanResult.filename || fileName,
                      status: scanResult.result,
                      confidence: `${(scanResult.probability * 100).toFixed(2)}%`,
                      date: scanResult.scanned_at
                        ? new Date(scanResult.scanned_at).toLocaleString()
                        : new Date().toLocaleString(),
                      scanId: scanResult.id,
                    },
                  });
                }
              }, 500);
            }
          }, 400);
        }

        return next <= 100 ? next : 100;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);


  return (
   <div className="flex flex-col items-center pt-24 px-4 md:px-6 lg:px-10 min-h-screen bg-[#0A1324]">
      {/* TITLE */}
      <h1 className="text-white text-3xl md:text-4xl font-semibold mb-4 text-center">
        Malware Detection Scanner
      </h1>

      <p className="text-gray-400 text-base md:text-lg mb-12 text-center max-w-2xl">
        Please wait while your file is being analyzed using AI-powered malware detection.
      </p>

      {/* MAIN PROGRESS CARD – REDUCED WIDTH */}
      <div className="w-full max-w-3xl bg-[#111C33] p-8 md:p-10 rounded-2xl shadow-2xl border border-[#1E2A44]">

        {/* LOADING ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#1E2A44] animate-pulse">
            <span className="text-3xl text-cyan-400">⟳</span>
          </div>
        </div>

        {/* FILE NAME */}
        <h2 className="text-lg md:text-xl text-white font-semibold mb-1 text-center">
          {fileName}
        </h2>

        {/* CURRENT STEP */}
        <p className="text-cyan-300 text-sm md:text-base mb-6 text-center">
          {steps[stepIndex]}
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full bg-[#0b1527] h-3 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* PERCENTAGE */}
        <p className="text-white text-sm md:text-base text-center mb-6">
          {progress}%
        </p>

        {/* INFORMATION BOX */}
        <div className="bg-[#0b1527] text-slate-300 p-4 rounded-lg text-sm md:text-base text-center">
          {error
            ? <span className="text-red-400">{error}</span>
            : "This process usually takes 20–30 seconds. Please do not close or refresh the page."}
        </div>
      </div>
    </div>
  );
};

export default function ProgressComponent() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-x-hidden">
      <HeaderLogin />
      <FileAnalysisProgress />
    </div>
  );
}
