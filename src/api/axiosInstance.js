import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mtg-spring.onrender.com",
  withCredentials: true, // indispensable pour envoyer/recevoir cookies
  timeout: 30000,
  maxContentLength: 5 * 1024 * 1024,
  maxBodyLength: 5 * 1024 * 1024,
});
/*
// Petit cache local du CSRF token
let csrfToken = null;

// Interceptor pour ajouter le CSRF token si nécessaire
axiosInstance.interceptors.request.use(
  async (config) => {
    // Si c'est une requête mutative (POST, PUT, DELETE) et qu'on n'a pas encore de token
    if (["post", "put", "delete"].includes(config.method) && !csrfToken) {
      try {
        const response = await axiosInstance.get("/f_csrf/csrf");
        csrfToken = response.data.token || response.headers["x-xsrf-token"];
      } catch (err) {
        console.error("Impossible de récupérer le CSRF token", err);
      }
    }

    // Si on a un token, on l’ajoute à la requête
    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
*/


// Petit cache local du CSRF token
let csrfToken = null;

// Interceptor pour ajouter le CSRF token si nécessaire
axiosInstance.interceptors.request.use(
  async (config) => {
    // Si c'est une requête mutative (POST, PUT, DELETE) et qu'on n'a pas encore de token
    if (["post", "put", "delete"].includes(config.method) && !csrfToken) {
      try {
        const response = await axiosInstance.get("/f_csrf/csrf");
        csrfToken = response.data.token || response.headers["x-xsrf-token"];
      } catch (err) {
        console.error("Impossible de récupérer le CSRF token", err);
      }
    }

    // Si on a un token, on l’ajoute à la requête
    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
