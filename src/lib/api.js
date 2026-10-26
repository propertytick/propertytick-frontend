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

    // 🛑 FIX 1: Login ya Register API ki 401 error par refresh logic mat chalao
    const isAuthRoute = originalRequest.url.includes('/auth/login') || 
                        originalRequest.url.includes('/auth/login-email-otp') ||
                        originalRequest.url.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
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
          
          // 🛑 FIX 2: Agar pehle se login page par hain, toh dobara redirect mat karo (warna infinite reload hoga)
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
      }
    }

    // Agar upar wala block nahi chala, toh error ko aage pass kar do (Taaki Login Page ka try/catch isko pakad sake)
    return Promise.reject(error);
  }
);

export default api;