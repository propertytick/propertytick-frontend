import axios from 'axios';

// Base URL setup: Render ka backend URL (Fallback bhi ab sahi hai)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://propertytick-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Cookies (refresh token) bhejne ke liye zaroori hai
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Ab ye 'token' key se hi padhega, jo login page save kar raha hai)
api.interceptors.request.use(
  (config) => {
    // Browser check (Next.js SSR me window undefined hota hai)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); // ✅ Yahan 'token' kar diya hai
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;