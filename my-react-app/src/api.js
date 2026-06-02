import axios from "axios";

// Dev: VITE_API_URL is empty → relative URLs → Vite proxy forwards to localhost:8000
// Prod: VITE_API_URL = http://18.226.64.135:8000 → direct cross-origin calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

// Attach stored user email as X-User-Email header on every request.
// Cookie works in dev (same origin via proxy); header works in production (cross-origin).
api.interceptors.request.use((config) => {
  const email = localStorage.getItem("user_email");
  if (email) config.headers["X-User-Email"] = email;
  return config;
});

// Auth
export const login = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => {
    localStorage.setItem("user_email", res.data.user.email);
    return res;
  });

export const register = (name, email, password) =>
  api.post("/auth/register", { name, email, password }).then((res) => {
    localStorage.setItem("user_email", res.data.user.email);
    return res;
  });

export const registerAdmin = () =>
  api.post("/auth/register", { name: "admin", email: "admin@admin.com", password: "Admin@123" });

export const ensureAdmin = () =>
  api.post("/auth/ensure-admin").then((res) => {
    localStorage.setItem("user_email", res.data.user.email);
    return res;
  });

export const logout = () =>
  api.post("/auth/logout").then((res) => {
    localStorage.removeItem("user_email");
    return res;
  });

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

export const uploadAsmScan = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/scan/upload-asm", form);
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
