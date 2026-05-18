import { useState } from "react";
import { Shield, Mail, Lock, Eye, User, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

export default function CreateAccountPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) { setError("All fields are required"); return; }
    try {
      await register(name, email, password);
      navigate("/scanmalware");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1324] flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="mb-6 bg-[#0d1a33] p-4 rounded-full flex items-center justify-center shadow-lg">
        <Shield className="text-[#14C9E7]" size={48} />
      </div>

      <div className="bg-[#111C33] w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl text-center">
        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8 text-sm md:text-base">
          Join Exe2Vision to start scanning files
        </p>

        {/* Name */}
        <div className="mb-6 text-left">
          <label className="text-gray-300 text-sm md:text-base">Full Name</label>
          <div
            className={`flex items-center p-3 rounded-lg mt-1 transition border ${
              nameFocused ? "border-[#14C9E7]" : "border-transparent"
            } bg-[#0A1324]`}
          >
            <User className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="John Doe"
              autoComplete="off"
              className="bg-transparent text-white w-full outline-none text-sm md:text-base"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6 text-left">
          <label className="text-gray-300 text-sm md:text-base">Email</label>
          <div
            className={`flex items-center p-3 rounded-lg mt-1 transition border ${
              emailFocused ? "border-[#14C9E7]" : "border-transparent"
            } bg-[#0A1324]`}
          >
            <Mail className="text-gray-400 mr-3" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="your.email@example.com" autoComplete="new-email"
              className="bg-transparent text-white w-full outline-none text-sm md:text-base"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6 text-left">
          <label className="text-gray-300 text-sm md:text-base">Password</label>
          <div
            className={`flex items-center p-3 rounded-lg mt-1 transition border ${
              passFocused ? "border-[#14C9E7]" : "border-transparent"
            } bg-[#0A1324]`}
          >
            <Lock className="text-gray-400 mr-3" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              placeholder="••••••••"
              autoComplete="off"
              className="bg-transparent text-white w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword(!showPassword)}
                className="ml-3 cursor-pointer text-[#14C9E7] transition"
                size={20}
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                className="ml-3 cursor-pointer text-gray-400 transition"
                size={20}
              />
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button onClick={handleRegister} className="w-full bg-[#14C9E7] hover:bg-[#11b5d1] text-white font-medium py-3 rounded-lg transition text-base">
          Create Account
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#14C9E7] hover:underline">Login</Link>
        </p>
      </div>

      <Link 
      to="/"
      className="mt-10 text-center text-[#02bfe7] text-sm cursor-pointer hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
