import axios from 'axios';

<<<<<<< HEAD
export const API_ORIGIN = 'http://localhost:8080';
export const API_BASE_URL = `${API_ORIGIN}/api`;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
=======
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
>>>>>>> 2db6dc0e3b2602e73bc1baa0f9f44512887310aa
    headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
