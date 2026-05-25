import axios, { AxiosInstance } from "axios";

// Singleton: garante que toda a aplicação use apenas uma
// instância compartilhada do cliente HTTP com a mesma configuração.
export class ApiClient {
  private static instance: ApiClient | null = null;
  public readonly axios: AxiosInstance;

  private constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:8000/api/v1/",
    });

    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public static getInstance(): ApiClient {
    if (ApiClient.instance === null) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
}
