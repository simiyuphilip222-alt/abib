const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const API_URL = `${API_BASE_URL}/api`;

export const toMediaUrl = (file, type = "images") => {
  if (!file) return null;
  if (/^https?:\/\//i.test(file)) return file;

  const normalizedFile = String(file).replace(/^\/+/, "");
  return `${API_BASE_URL}/media/${type}/${normalizedFile}`;
};
