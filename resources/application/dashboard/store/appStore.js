import { create } from 'zustand';
import axios from '../bootstrap';

export const useAppStore = create((set) => ({
    usdRate: null,
    usdRateFormatted: null,
    isLoading: false,

    // Fetch current USD rate
    fetchUSDRate: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get('/currency/rate');
            set({
                usdRate: response.data.data.rate,
                usdRateFormatted: response.data.data.rate_formatted,
            });
        } catch (error) {
            console.error('Failed to fetch USD rate:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Set USD rate
    setUSDRate: (rate, formatted) => {
        set({
            usdRate: rate,
            usdRateFormatted: formatted,
        });
    },
}));
