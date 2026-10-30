import { create } from 'zustand';
import api from '@/lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  init: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ token, user, isAuthenticated: true });
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  },

  sendOtp: async (phone, purpose = 'login') => {
    const { data } = await api.post('/auth/send-otp', { phone, purpose });
    return data;
  },

  verifyLoginOtp: async (phone, otp, purpose = 'login') => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/verify-login-otp', { phone, otp, purpose });
      if (data.success) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        set({
          token: data.data.accessToken,
          user: data.data.user,
          isAuthenticated: true,
        });
      }
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (role, payload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post(`/auth/register/${role}`, payload);
      if (data.success) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        set({
          token: data.data.accessToken,
          user: data.data.user,
          isAuthenticated: true,
        });
      }
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  refreshProfile: async () => {
    const { data } = await api.get('/auth/me');
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
      set({ user: data.data.user });
    }
  },
}));

export default useAuthStore;
