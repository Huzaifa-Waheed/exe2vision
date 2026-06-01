import { useLocation, useNavigate } from "react-router-dom";
import HeaderLogin from "../components/HeaderAfterLogin";
import { ShieldCheck, Calendar, File, Target, Shield } from "lucide-react";
import { downloadScanReport } from "../api";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    fileName = "Unknown.exe",
    date = "N/A",
    confidence = "N/A",
    status = "Benign",
    scanId,
  } = location.state || {};

  const handleDownload = async () => {
    if (!scanId) return;
    try {
      const res = await downloadScanReport(scanId);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scan_${scanId}_report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1324] text-white px-4 pt-24">

      <h1 className="text-center text-3xl md:text-4xl font-bold mb-10">
        Scan Results
      </h1>

      {/* Main Card */}
      <div className="w-full max-w-5xl mx-auto bg-[#111C33] rounded-2xl shadow-xl p-8 md:p-14">

        {/* Top Section */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#0A1324] flex items-center justify-center">
            <ShieldCheck size={50} className={status === "Malware" ? "text-red-400" : "text-green-400"} />
          </div>

          <h2 className={`text-xl md:text-2xl font-semibold mt-4 ${
            status === "Malware" ? "text-red-400" : "text-green-400"
          }`}>
            File is {status === "Malware" ? "Malicious" : "Benign"}
          </h2>

          <p className="text-gray-300 text-center max-w-xl mt-3">
            {status === "Malware"
              ? "Our AI model has detected signs of malicious behavior in this file. Exercise caution."
              : "Our AI model has analyzed this file and found no signs of malicious behavior. The file appears to be safe."
            }
          </p>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

          {/* Filename */}
          <div className="bg-[#0D162A] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <File size={18} /> <span>Filename</span>
            </div>
            <p className="text-white font-semibold break-all">{fileName}</p>
          </div>

          {/* Scan Date */}
          <div className="bg-[#0D162A] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <Calendar size={18} /> <span>Scan Date</span>
            </div>
            <p className="text-white font-semibold">{date}</p>
          </div>

          {/* Confidence Score */}
          <div className="bg-[#0D162A] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <Target size={18} /> <span>Confidence Score</span>
            </div>
            <p className="text-white font-semibold">
              {confidence} <span className="text-green-400 ml-2">High</span>
            </p>
          </div>

          {/* Status */}
          <div className="bg-[#0D162A] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <Shield size={18} /> <span>Status</span>
            </div>
            <p className={`font-semibold ${
              status === "Malware" ? "text-red-400" : "text-green-400"
            }`}>
              {status === "Malware" ? "Malicious" : "Safe"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <button onClick={handleDownload} disabled={!scanId} className="bg-cyan-500 hover:bg-cyan-600 text-white w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-50">
            ⬇ Download PDF Report
          </button>

          <button
            onClick={() => navigate("/scanmalware")}
            className="bg-transparent border border-gray-500 hover:border-cyan-400 hover:text-cyan-400 w-full py-3 rounded-xl font-semibold"
          >
            Scan Another File
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ProgressComponent() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-x-hidden">
      <HeaderLogin />
      <ResultPage />
    </div>
  );
}