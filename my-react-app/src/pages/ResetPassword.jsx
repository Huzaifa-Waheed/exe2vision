import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { requestReset } from "../api";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [emailFocused, setEmailFocused] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSendCode = async () => {
        if (!email) { setError("Email is required"); return; }
        if (!validateEmail(email)) { setError("Please enter a valid email address"); return; }
        setError("");
        try {
            await requestReset(email);
            navigate("/otp-verification", { state: { email } });
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to send code");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1324] flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
            {/* Top Shield Icon */}
            <div className="mb-6 bg-[#0d1a33] p-4 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="text-[#14C9E7]" size={48} />
            </div>

            {/* Card */}
            <div className="bg-[#111C33] w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl text-center">
                <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">Reset Password</h2>
                <p className="text-gray-400 mb-8 text-sm md:text-base">
                    Enter your registered email to receive a verification code
                </p>

                {/* Email Input */}
                <div className="mb-2 text-left">
                    <label className="text-gray-300 text-sm md:text-base">Email</label>
                    <div
                        className={`flex items-center p-3 rounded-lg mt-1 transition border ${emailFocused ? "border-[#14C9E7]" : "border-transparent"
                            } bg-[#0A1324]`}
                    >
                        <Mail className="text-gray-400 mr-3" size={20} />
                        <input
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            className="bg-transparent text-white w-full outline-none text-sm md:text-base"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                {/* Send Verification Code Button */}
                <button
                    onClick={handleSendCode}
                    className="w-full bg-[#14C9E7] hover:bg-[#11b5d1] text-white font-medium py-3 rounded-lg text-base transition mt-4 cursor-pointer"
                >
                    Send Verification Code
                </button>

                <Link to="/login" className="text-[#14C9E7] text-sm mt-3 hover:underline cursor-pointer block">
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}
