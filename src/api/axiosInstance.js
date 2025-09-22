import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mtg-spring.onrender.com",
  withCredentials: true, // indispensable pour envoyer/recevoir cookies
  timeout: 30000,
  maxContentLength: 5 * 1024 * 1024,
  maxBodyLength: 5 * 1024 * 1024,
}); 

// Helper pour lire un cookie
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

// Interceptor pour ajouter le CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    if (["post", "put", "delete"].includes((config.method || "").toLowerCase())) {
      const token = getCookie("XSRF-TOKEN");
      if (token) {
        config.headers["X-XSRF-TOKEN"] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
