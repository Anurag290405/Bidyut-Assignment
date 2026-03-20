import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://bidyut-assignment.onrender.com/api',
    withCredentials: true, // Important for cookies
});

export default api;
