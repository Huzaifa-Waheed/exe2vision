import { useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login, ensureAdmin } from "../api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_PASSWORD = "Admin@123";

  const handleLogin = async () => {
    let tempErrors = { email: "", password: "" };
    let valid = true;

    if (!email) { tempErrors.email = "Email is required"; valid = false; }
    else if (!validateEmail(email)) { tempErrors.email = "Enter a valid email"; valid = false; }
    if (!password) { tempErrors.password = "Password is required"; valid = false; }
    else if (password.length < 6) { tempErrors.password = "Password must be at least 6 characters"; valid = false; }

    setErrors(tempErrors);
    if (!valid) return;

    // Admin credentials entered — seed if needed then go to dashboard
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        await ensureAdmin();
        navigate("/admin-dashboard");
      } catch (err) {
        setErrors({ email: "", password: err.response?.data?.detail || "Admin login failed" });
      }
      return;
    }

    try {
      const res = await login(email, password);
      const user = res.data.user;
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/scanmalware");
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      setErrors({ email: "", password: msg });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1324] flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="mb-6 bg-[#0d1a33] p-4 rounded-full flex items-center justify-center shadow-lg">
        <Shield className="text-[#14C9E7]" size={48} />
      </div>

      <div className="bg-[#111C33] w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl text-center">
        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-8 text-sm md:text-base">Sign in to your Exe2Vision account</p>

        {/* Email */}
        <div className="mb-2 text-left">
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
              placeholder="your.email@example.com"
              autoComplete="off"
              className="bg-transparent text-white w-full outline-none text-sm md:text-base"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-2 text-left">
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
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="text-right mb-6">
          <Link to="/reset-password" className="text-[#14C9E7] text-sm hover:underline">
            Forgot your password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#14C9E7] hover:bg-[#11b5d1] text-white font-medium py-3 rounded-lg transition text-base cursor-pointer"
        >
          Login
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#14C9E7] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      <Link to="/" className="mt-10 text-center text-[#02bfe7] text-sm cursor-pointer hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
