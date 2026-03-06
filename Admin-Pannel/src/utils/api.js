import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("qh_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const adminLogin = (data) => api.post("/auth/admin/login", data);

// Jobs
export const getJobs = (params = {}) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Applications
export const getAllApplications = (params = {}) => api.get("/applications", { params });
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status });
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export default api;
