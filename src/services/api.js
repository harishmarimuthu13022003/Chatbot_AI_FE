import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  signup: async (username, email, password) => {
    return await api.post('/auth/signup', { username, email, password });
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

export const chatService = {
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },
  createChat: async (title) => {
    const response = await api.post('/chats', { title });
    return response.data;
  },
  getChatMessages: async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },
  sendMessage: async (chatId, content) => {
    const response = await api.post('/chat', { chat_id: chatId, content });
    return response.data;
  }
};

export default api;
