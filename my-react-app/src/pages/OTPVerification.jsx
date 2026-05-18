import { useState, useEffect, useRef } from "react";
import { Shield, Clock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputsRef.current[index - 1].focus();
  };

  const isComplete = code.every((digit) => digit !== "");

  const handleVerify = () => {
    if (isComplete) {
      // Pass email + otp to SetNewPassword page
      navigate("/set-new-password", { state: { email, otp_code: code.join("") } });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1324] flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="mb-6 bg-[#0d1a33] p-4 rounded-full flex items-center justify-center shadow-lg">
        <Shield className="text-[#14C9E7]" size={48} />
      </div>

      <div className="bg-[#111C33] w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl text-center">
        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">Verify Code</h2>
        <p className="text-gray-400 text-sm md:text-base mb-6">
          We sent a verification code to <span className="text-[#14C9E7]">{email}</span>
        </p>

        <div className="flex justify-between mb-6">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-10 h-12 md:w-12 md:h-14 text-center text-white text-xl rounded-lg bg-[#0A1324] border border-transparent focus:border-[#14C9E7] outline-none"
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-[#14C9E7] mb-6">
          <Clock size={20} />
          <span className="text-sm md:text-base">Time remaining: {formatTime()}</span>
        </div>

        <button
          disabled={!isComplete}
          onClick={handleVerify}
          className={`w-full py-3 rounded-lg text-white font-medium text-base transition ${isComplete
              ? "bg-[#14C9E7] hover:bg-[#11b5d1] cursor-pointer"
              : "bg-gray-600 cursor-not-allowed"
            }`}
        >
          Verify Code
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Didn't receive the code? <span className="text-[#14C9E7] hover:underline cursor-pointer">Resend Code</span>
        </p>

        <Link to="/reset-password" className="text-[#14C9E7] text-sm mt-3 hover:underline cursor-pointer block">
          ← Change Email
        </Link>
      </div>
    </div>
  );
}
