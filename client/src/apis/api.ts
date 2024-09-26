import axios from "axios";

const API_URL = 'https://musicspace-duog.onrender.com/api';

export const api = axios.create({
    baseURL: API_URL
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirect to login page or refresh token
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);
