import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Goals API
export const goalsAPI = {
  getAll: (params?: { category?: string; status?: string }) =>
    api.get('/goals', { params }),
  getById: (id: string) =>
    api.get(`/goals/${id}`),
  create: (data: any) =>
    api.post('/goals', data),
  update: (id: string, data: any) =>
    api.put(`/goals/${id}`, data),
  delete: (id: string) =>
    api.delete(`/goals/${id}`),
};

// Progress API
export const progressAPI = {
  getByGoal: (goalId: string, params?: { startDate?: string; endDate?: string }) =>
    api.get(`/progress/goal/${goalId}`, { params }),
  create: (data: any) =>
    api.post('/progress', data),
  update: (id: string, data: any) =>
    api.put(`/progress/${id}`, data),
  delete: (id: string) =>
    api.delete(`/progress/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () =>
    api.get('/analytics/dashboard'),
  getGoalProgress: (goalId: string, params?: { startDate?: string; endDate?: string }) =>
    api.get(`/analytics/goal/${goalId}/progress`, { params }),
  getTrends: (params?: { category?: string; startDate?: string; endDate?: string }) =>
    api.get('/analytics/trends', { params }),
};

export default api;
