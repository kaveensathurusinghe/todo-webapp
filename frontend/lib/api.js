import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);
export const logout   = ()     => api.post('/auth/logout');
export const getMe    = ()     => api.get('/auth/me');

// Todos
export const getTodos      = (params) => api.get('/todos', { params });
export const createTodo    = (data)   => api.post('/todos', data);
export const getTodo       = (id)     => api.get(`/todos/${id}`);
export const updateTodo    = (id, data) => api.put(`/todos/${id}`, data);
export const deleteTodo    = (id)     => api.delete(`/todos/${id}`);
export const toggleStatus  = (id)     => api.patch(`/todos/${id}/status`);

export default api;
