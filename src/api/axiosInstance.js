import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mtg-spring.onrender.com",
  withCredentials: true, // indispensable pour envoyer/recevoir cookies
  timeout: 30000,
  maxContentLength: 5 * 1024 * 1024,
  maxBodyLength: 5 * 1024 * 1024,
});

// Petit cache local du CSRF token
let csrfToken = null;

// Interceptor pour ajouter le CSRF token si nécessaire

axiosInstance.interceptors.request.use(
  async (config) => {
    if (["post", "put", "delete"].includes(config.method) && !csrfToken) {
      try {
        const response = await axiosInstance.get("/f_csrf/csrf");
        csrfToken = response.data.token || response.headers["x-xsrf-token"];
      } catch (err) {
        console.error("Impossible de récupérer le CSRF token", err);
      }
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

