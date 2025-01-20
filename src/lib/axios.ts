import axios from "axios";

// Configuração da URL base
const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:3000/api",
});

export default api;
