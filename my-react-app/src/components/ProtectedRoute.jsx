import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../api";

// adminOnly: if true, only role=admin can access; regular users get redirected to /scanmalware
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [status, setStatus] = useState("loading"); // loading | auth | unauth
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getMe()
      .then((res) => {
        setIsAdmin(res.data.user.role === "admin");
        setStatus("auth");
      })
      .catch(() => setStatus("unauth"));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0A1324] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauth") return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/scanmalware" replace />;

  return children;
};

export default ProtectedRoute;
