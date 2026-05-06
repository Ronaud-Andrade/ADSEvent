/* Importa a biblioteca axios para fazer requisições HTTP */
import axios from "axios";

/* Cria uma instância personalizada do axios */
const api = axios.create({
  /* Define a URL base da API */
  baseURL: "http://127.0.0.1:8000/api/v1/",
});

/* Interceptor que roda antes de cada requisição */
api.interceptors.request.use((config) => {
  /* Pega o token salvo no navegador */
  const token = localStorage.getItem("token");

  /* Se existir token, adiciona no cabeçalho */
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

/* Tipagem do usuário */
export interface User {
  id: number;
  username: string;
}


/* Auth API */
export const authAPI = {
  /* Login */
  login: async (data: { username: string; password: string }) => {
    const response = await api.post("auth/login/", data);
    return response.data; // { token, user }
  },

  /* Logout */
  logout: async () => {
    await api.post("auth/logout/");
  },

  /* Pega dados do usuário logado */
  user: async () => {
    const response = await api.get("auth/user/");
    return response.data;
  },
};

/* Exporta a instância principal */
export default api;