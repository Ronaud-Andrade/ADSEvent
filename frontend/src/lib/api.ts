/* Importa o cliente HTTP Singleton e os tipos TypeScript */
import { ApiClient } from "./ApiClient";
import { Event } from "../types/events";

/* Facade: expõe métodos de alto nível para consumir a API sem precisar
   lidar diretamente com axios, URLs ou headers em cada componente. */
const api = ApiClient.getInstance().axios;

/* Tipagem do usuário */
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

/* Tipagem de categorias */
export interface Category {
  id: number;
  name: string;
}

/* Tipagem de inscrições */
export interface Subscribe {
  id?: number;
  client: User;
  events: Event;
  events_id?: number; // Para criação/edição
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

/* Auth API */
export const authAPI = {
  /* Login */
  login: async (data: { username: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("auth/login/", data);
    return response.data;
  },

  signup: async (data: { username: string; password: string }): Promise<User> => {
    const response = await api.post<User>("auth/signup/", data);
    return response.data;
  },

  /* Refresh de access token */
  refresh: async (refresh: string): Promise<{ access: string }> => {
    const response = await api.post<{ access: string }>("auth/refresh/", { refresh });
    return response.data;
  },

  /* Logout */
  logout: async (refresh?: string) => {
    await api.post("auth/logout/", refresh ? { refresh } : {});
  },

  /* Pega dados do usuário logado */
  user: async () => {
    const response = await api.get("auth/user/");
    return response.data;
  },
};

export const categoryAPI = {
  getCategories: async (page: number = 1, search: string = ''): Promise<PaginatedResponse<Category>> => {
    const response = await api.get<PaginatedResponse<Category>>("categories/", {
      params: { page, search: search || undefined },
    });
    return response.data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`categories/${id}/`);
    return response.data;
  },

  createCategory: async (data: { name: string }): Promise<Category> => {
    const response = await api.post<Category>("categories/", data);
    return response.data;
  },

  updateCategory: async (id: number, data: { name: string }): Promise<Category> => {
    const response = await api.put<Category>(`categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`categories/${id}/`);
  },
};

export const eventsAPI = {
  getEvents: async (page: number = 1, search: string = ''): Promise<PaginatedResponse<Event>> => {
    const response = await api.get<PaginatedResponse<Event>>("events/", {
      params: { page, search: search || undefined },
    });
    return response.data;
  },

  getEvent: async (id: number): Promise<Event> => {
    const response = await api.get<Event>(`events/${id}/`);
    return response.data;
  },

  createEvent: async (data: Omit<Event, 'id'>): Promise<Event> => {
    const response = await api.post<Event>("events/", data);
    return response.data;
  },

  updateEvent: async (id: number, data: Partial<Event>): Promise<Event> => {
    const response = await api.put<Event>(`events/${id}/`, data);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`events/${id}/`);
  },
};

export const subscribeAPI = {
  getUserSubscribes: async (page: number = 1): Promise<PaginatedResponse<Subscribe>> => {
    const response = await api.get<PaginatedResponse<Subscribe>>("subscribes/", {
      params: { page },
    });
    return response.data;
  },

  getSubscribe: async (id: number): Promise<Subscribe> => {
    const response = await api.get<Subscribe>(`subscribes/${id}/`);
    return response.data;
  },

  createSubscribe: async (data: { events_id: number }): Promise<Subscribe> => {
    const response = await api.post<Subscribe>("subscribes/", data);
    return response.data;
  },

  updateSubscribe: async (id: number, data: Partial<Pick<Subscribe, 'active'>>): Promise<Subscribe> => {
    const response = await api.put<Subscribe>(`subscribes/${id}/`, data);
    return response.data;
  },

  deleteSubscribe: async (id: number): Promise<void> => {
    await api.delete(`subscribes/${id}/`);
  },
};

/* Exporta a instância principal */
export default api;