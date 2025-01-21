import axios from "axios";

// Configuração da URL base
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

export default api;
