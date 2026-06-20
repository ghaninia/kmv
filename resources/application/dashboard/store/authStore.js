import { create } from 'zustand';
import axios from '../bootstrap';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    isInitialized: false,
    isAuthenticated: false,

    // Check if user is logged in
    checkAuth: async () => {
        try {
            const response = await axios.get('/auth/user');
            set({ user: response.data.user, isAuthenticated: !!response.data.user });
        } catch (error) {
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isInitialized: true });
        }
    },

    // Login user
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axios.post('/auth/login', { email, password });
            set({ user: response.data.user, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'ورود ناموفق بود';
            return { success: false, message };
        } finally {
            set({ isLoading: false });
        }
    },

    // Logout user
    logout: async () => {
        try {
            await axios.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },
}));
