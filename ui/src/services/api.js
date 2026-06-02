import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

let authStoreRef = null;

export function bindAuthStore(store) {
    authStoreRef = store;
}

api.interceptors.request.use((config) => {
    const token = authStoreRef?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && authStoreRef) {
            authStoreRef.logout();
            if (
                typeof window !== 'undefined' &&
                window.location.pathname !== '/login'
            ) {
                window.location.assign('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api;