import axios from "axios";

// Configuração da URL base
const api = axios.create({
  baseURL: "http://localhost:3000/api/",
});

export default api;
