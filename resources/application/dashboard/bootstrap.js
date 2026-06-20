import axios from 'axios';

// Set default API base URL
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

// Add CSRF token to requests
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Add request interceptor
axios.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
);

// Add response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized (SPA is served under /admin)
            if (!window.location.pathname.startsWith('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
