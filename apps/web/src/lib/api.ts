import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
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
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    familyName: string;
  }) => api.post('/auth/register', data),
  
  me: () => api.get('/auth/me'),
  
  refresh: () => api.post('/auth/refresh'),
};

// Children API
export const childrenApi = {
  list: () => api.get('/children'),
  get: (id: string) => api.get(`/children/${id}`),
  create: (data: {
    displayName: string;
    birthDate?: string;
    deviceType?: 'ios' | 'android';
    deviceId?: string;
  }) => api.post('/children', data),
  update: (id: string, data: Partial<{
    displayName: string;
    birthDate: string;
    alertThreshold: 'low' | 'medium' | 'high';
    monitoredApps: string[];
    isActive: boolean;
  }>) => api.put(`/children/${id}`, data),
  delete: (id: string) => api.delete(`/children/${id}`),
  activity: (id: string) => api.get(`/children/${id}/activity`),
  wellbeing: (id: string) => api.get(`/children/${id}/wellbeing`),
};

// Alerts API
export const alertsApi = {
  list: (params?: {
    severity?: string;
    status?: string;
    childId?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }) => api.get('/alerts', { params }),
  
  get: (id: string) => api.get(`/alerts/${id}`),
  
  acknowledge: (id: string, notes?: string) =>
    api.post(`/alerts/${id}/acknowledge`, { notes }),
  
  resolve: (id: string, notes?: string) =>
    api.post(`/alerts/${id}/resolve`, { notes }),
  
  falsePositive: (id: string, notes?: string) =>
    api.post(`/alerts/${id}/false-positive`, { notes }),
  
  addNote: (id: string, notes: string) =>
    api.post(`/alerts/${id}/note`, { notes }),
  
  trends: (days?: number) => api.get('/alerts/stats/trends', { params: { days } }),
};

// Dashboard API
export const dashboardApi = {
  summary: () => api.get('/dashboard/summary'),
  activities: () => api.get('/dashboard/activities'),
  safetyScores: () => api.get('/dashboard/safety-scores'),
  recentMessages: (limit?: number) =>
    api.get('/dashboard/recent-messages', { params: { limit } }),
  stats: (days?: number) => api.get('/dashboard/stats', { params: { days } }),
};

// Content API (for testing)
export const contentApi = {
  submitMessage: (data: {
    childId: string;
    content: string;
    sourceApp: string;
    senderId: string;
    senderName: string;
    conversationId: string;
    contentType?: 'text' | 'image' | 'video';
    senderType?: 'contact' | 'unknown' | 'group';
    sentAt?: string;
  }) => api.post('/content/message', data),
};

export default api;
