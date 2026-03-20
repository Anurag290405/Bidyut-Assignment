import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://bidyut-assignment.onrender.com';

const api = axios.create({
    baseURL: BACKEND_URL + '/api',
    withCredentials: true, // Important for cookies
});

// Add a request interceptor to include the token in headers (for mobile/ITP compatibility)
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('chatUser'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
