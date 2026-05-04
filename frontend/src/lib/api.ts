import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  title: string;
  descriptions: string;
  date_time: string;
  local: string;
  vagas: number;
  category: number[] | Category[];
}

export interface Subscribe {
  id: number;
  client: User;
  events: Event;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout/');
  },

  getUser: async (): Promise<User> => {
    const response = await api.get('/auth/user/');
    return response.data;
  },
};

export const eventsAPI = {
  getEvents: async (page = 1): Promise<PaginatedResponse<Event>> => {
    const response = await api.get('/events/', {
      params: { page },
    });
    return response.data;
  },

  getEvent: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}/`);
    return response.data;
  },

  createEvent: async (data: Omit<Event, 'id'>): Promise<Event> => {
    const response = await api.post('/events/', data);
    return response.data;
  },

  updateEvent: async (id: number, data: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}/`, data);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}/`);
  },
};

export const categoryAPI = {
  getCategories: async (page = 1): Promise<PaginatedResponse<Category>> => {
    const response = await api.get('/categories/', {
      params: { page },
    });
    return response.data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post('/categories/', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/`);
  },

  getAllCategories: async (): Promise<Category[]> => {
    let page = 1;
    const allCategories: Category[] = [];

    while (true) {
      const response = await api.get('/categories/', {
        params: { page },
      });
      const data: PaginatedResponse<Category> = response.data;
      allCategories.push(...(data.results || []));
      if (!data.next) break;
      page += 1;
    }

    return allCategories;
  },
};

export const subscribeAPI = {
  getUserSubscribes: async (page = 1): Promise<PaginatedResponse<Subscribe>> => {
    const response = await api.get('/subscribes/', {
      params: { page },
    });
    return response.data;
  },

  createSubscribe: async (eventId: number): Promise<Subscribe> => {
    const response = await api.post('/subscribes/', { events_id: eventId });
    return response.data;
  },

  updateSubscribe: async (id: number, data: Partial<Subscribe>): Promise<Subscribe> => {
    const response = await api.put(`/subscribes/${id}/`, data);
    return response.data;
  },

  deleteSubscribe: async (id: number): Promise<void> => {
    await api.delete(`/subscribes/${id}/`);
  },

  getAllUserSubscribes: async (): Promise<Subscribe[]> => {
    let page = 1;
    const allSubscribes: Subscribe[] = [];

    while (true) {
      const response = await api.get('/subscribes/', {
        params: { page },
      });
      const data: PaginatedResponse<Subscribe> = response.data;
      allSubscribes.push(...(data.results || []));
      if (!data.next) {
        break;
      }
      page += 1;
    }

    return allSubscribes;
  },
};

export default api;