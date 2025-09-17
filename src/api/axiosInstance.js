import axios from 'axios';


// Création de l'instance Axios
const axiosInstance = axios.create({
  baseURL: 'https://mtg-spring.onrender.com',
  withCredentials: true,              // cookies JWT et session
});

/*
// Stockage des tokens
let csrfToken = null;
let jwtToken = null;

// Intercepteur pour injecter CSRF et JWT
axiosInstance.interceptors.request.use(
  (config) => {
    if (csrfToken) config.headers['X-XSRF-TOKEN'] = csrfToken;
    if (jwtToken) config.headers['Authorization'] = `Bearer ${jwtToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonctions pour mettre à jour les tokens
export const setCsrfToken = (token) => { csrfToken = token; };
export const setJwtToken = (token) => { jwtToken = token; };
*/

export default axiosInstance;
