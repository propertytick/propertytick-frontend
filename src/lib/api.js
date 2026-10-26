import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 60000,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('bhoomi_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 CHECK 1: Agar login/register/otp route hai, toh kuch mat karo, seedha error return karo
    const requestUrl = originalRequest?.url || "";
    const isAuthRoute = requestUrl.includes('/auth/login') || 
                        requestUrl.includes('/auth/login-email-otp') ||
                        requestUrl.includes('/auth/verify-login-email-otp') ||
                        requestUrl.includes('/auth/register');

    // Agar auth route hai, toh refresh logic ko skip karo
    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // 🛑 CHECK 2: Sirf baaki routes ke liye refresh logic chalao
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        if (data.success) {
          localStorage.setItem('bhoomi_token', data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest); // Retry original request
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bhoomi_token');
          localStorage.removeItem('bhoomi_user');
          
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;