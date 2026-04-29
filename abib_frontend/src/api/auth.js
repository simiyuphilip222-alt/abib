import axios from "axios";
import { API_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);
export const verifyEmail = (token) => API.get(`/verify/${token}`);
export const forgotPassword = (data) => API.post("/forgot-password", data);
export const resetPassword = (token, data) =>
  API.post(`/reset-password/${token}`, data);
export const getCurrentUser = (token) =>
  API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
