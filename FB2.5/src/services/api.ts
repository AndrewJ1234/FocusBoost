import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Activity API
export const activityAPI = {
  createSession: (data: any) => api.post('/activity/sessions', data),
  getSessions: (params?: any) => api.get('/activity/sessions', { params }),
  getCategories: (period?: string) =>
    api.get('/activity/categories', { params: { period } }),
  syncActivities: (activities: any[]) =>
    api.post('/activity/sync', { activities }),
  sendRealTimeData: (data: any) => api.post('/activity/realtime', data),
};

// Analytics API
export const analyticsAPI = {
  getProductivityTrends: (period: string) =>
    api.get('/analytics/trends', { params: { period } }),
  getSleepCorrelation: () => api.get('/analytics/sleep-correlation'),
  getPerformanceWindows: () => api.get('/analytics/performance-windows'),
  getInsights: () => api.get('/analytics/insights'),
};

// Wellness API
export const wellnessAPI = {
  logData: (data: any) => api.post('/wellness/log', data),
  getData: (startDate?: string, endDate?: string) =>
    api.get('/wellness/data', { params: { startDate, endDate } }),
  getCorrelations: () => api.get('/wellness/correlations'),
};

// Flashcard API
export const flashcardAPI = {
  getDecks: () => api.get('/flashcards/decks'),
  createDeck: (data: any) => api.post('/flashcards/decks', data),
  getDeck: (deckId: string) => api.get(`/flashcards/decks/${deckId}`),
  updateDeck: (deckId: string, data: any) =>
    api.put(`/flashcards/decks/${deckId}`, data),
  deleteDeck: (deckId: string) => api.delete(`/flashcards/decks/${deckId}`),
  
  getCards: (deckId: string) => api.get(`/flashcards/decks/${deckId}/cards`),
  createCard: (deckId: string, data: any) =>
    api.post(`/flashcards/decks/${deckId}/cards`, data),
  updateCard: (cardId: string, data: any) =>
    api.put(`/flashcards/cards/${cardId}`, data),
  deleteCard: (cardId: string) => api.delete(`/flashcards/cards/${cardId}`),
  
  reviewCard: (cardId: string, rating: number) =>
    api.post(`/flashcards/cards/${cardId}/review`, { rating }),
  getDueCards: (deckId: string) =>
    api.get(`/flashcards/decks/${deckId}/due-cards`),
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobalLeaderboard: (category?: string, period?: string) =>
    api.get('/leaderboard/global', { params: { category, period } }),
  getUserRank: () => api.get('/leaderboard/user-rank'),
  getFriends: () => api.get('/leaderboard/friends'),
};

// Notifications API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (settings: any) =>
    api.put('/notifications/settings', settings),
};

export default api;