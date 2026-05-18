import axios from "axios";

const api = axios.create({ withCredentials: true });

// Auth
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const register = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const registerAdmin = () =>
  api.post("/auth/register", { name: "admin", email: "admin@admin.com", password: "Admin@123" });

export const ensureAdmin = () => api.post("/auth/ensure-admin");

export const logout = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me");

export const requestReset = (email) =>
  api.post("/auth/request-reset", { email });

export const resetPassword = (email, otp_code, new_password) =>
  api.post("/auth/reset-password", { email, otp_code, new_password });

// Scan
export const uploadScan = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/scan/upload", form);
};

export const getScanHistory = (params = {}) =>
  api.get("/scan/history", { params });

export const downloadScanReport = (scanId) =>
  api.get(`/scan/report/${scanId}`, { responseType: "blob" });

export const downloadHistoryReport = (params = {}) =>
  api.get("/scan/report", { params, responseType: "blob" });

// Admin
export const getAllScans = () => api.get("/admin/scans");

export const deleteScan = (id) => api.delete(`/admin/scan/${id}`);

export const deleteSelectedScans = (ids) =>
  api.delete("/admin/scans", { data: { ids } });

export const deleteAllScans = () => api.delete("/admin/scans/all");
