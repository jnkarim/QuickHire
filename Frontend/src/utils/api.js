import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("qh_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// ── Jobs ──────────────────────────────────────────────
export const getJobs = (params = {}) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getCategories = () => api.get("/jobs/categories");
export const getJobApplications = (id) => api.get(`/jobs/${id}/applications`);

// ── Applications ──────────────────────────────────────
export const submitApplication = (data) => api.post("/applications", data);
export const getAllApplications = (params = {}) =>
  api.get("/applications", { params });
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status });
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export default api;
