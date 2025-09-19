import axios from 'axios';


// Création de l'instance Axios
const axiosInstance = axios.create({
  baseURL: 'https://localhost:8443', // adapte si nécessaire
  withCredentials: true,              // cookies JWT et session
});

export default axiosInstance;
