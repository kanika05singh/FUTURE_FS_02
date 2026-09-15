import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends/receives the httpOnly JWT cookie
  headers: { 'Content-Type': 'application/json' },
});

// If the session has expired (401) anywhere other than the login attempt itself,
// send the admin back to the login screen instead of leaving every page stuck
// on a generic "couldn't load" error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? '';
    const isAuthCheck = url.includes('/auth/login') || url.includes('/auth/me');
    const isAlreadyOnLogin = window.location.pathname === '/login';

    if (error.response?.status === 401 && !isAuthCheck && !isAlreadyOnLogin) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
