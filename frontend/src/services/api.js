import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.warn(
    "VITE_API_BASE_URL is not set. Falling back to http://localhost:5000/api/v1. " +
    "Create a .env file in the frontend folder (see .env.example)."
  );
}

const resolvedBaseURL = baseURL || "http://localhost:5000/api/v1";

// Origin without the /api/v1 suffix — used to build links to static
// files served directly by the backend (e.g. uploaded resume PDFs).
export const API_ORIGIN = resolvedBaseURL.replace(/\/api\/v1\/?$/, "");

const API = axios.create({
  baseURL: resolvedBaseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;