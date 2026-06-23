import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    
    if (error.response?.status === 401 && !error.config.url.includes('/auth/me')) {
      
      if (typeof window !== 'undefined') {
        
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
