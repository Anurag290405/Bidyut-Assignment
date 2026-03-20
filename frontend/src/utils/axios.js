import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://bidyut-assignment.onrender.com';

const api = axios.create({
    baseURL: BACKEND_URL + '/api',
    withCredentials: true, // Important for cookies
});

export default api;
