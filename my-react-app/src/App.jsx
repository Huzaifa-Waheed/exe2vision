import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import OTPVerification from "./pages/OTPVerification.jsx";
import SetNewPasswordPage from "./pages/SetNewPassword.jsx";
import SignUp from "./pages/UserSignUp.jsx";
import AboutResearch from "./pages/AboutResearch";
import ExeVisionHome from "./pages/ExeVisionHome";
import ScanMalware from "./pages/ScanMalware.jsx";
import ProgressBar from "./pages/ProgressBar.jsx";
import Result from "./pages/Result.jsx";
import ScanHistoryComponent from "./pages/ScanHistory";
import AdminPage from "./pages/AdminPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<ExeVisionHome />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/set-new-password" element={<SetNewPasswordPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutResearch />} />

          <Route path="/scanmalware" element={
            <ProtectedRoute><ScanMalware /></ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute><ProgressBar /></ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute><Result /></ProtectedRoute>
          } />
          <Route path="/scanhistory" element={
            <ProtectedRoute><ScanHistoryComponent /></ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
