import axios from 'axios';


// Création de l'instance Axios
const axiosInstance = axios.create({
  baseURL: 'https://mtg-spring.onrender.com',
  withCredentials: true, 
  timeout: 30000,                       // 30 secondes (ajuste selon besoin)
  maxContentLength: 5 * 1024 * 1024,   // 5 MB max pour la réponse
  maxBodyLength: 5 * 1024 * 1024,      // 5 MB max pour l’upload
}); 



export default axiosInstance;
