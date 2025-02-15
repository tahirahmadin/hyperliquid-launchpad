import axios from "axios";
import { config } from "@/config/env";

const api = axios.create({
  baseURL: config.apiUrl,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to home page
    }
    return Promise.reject(error);
  }
);

export default api;
