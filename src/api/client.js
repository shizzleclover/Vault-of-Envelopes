import axios from 'axios';

// Import local data for offline fallback
import localEnvelopes from '../data/envelopes.json';
import localTarotCards from '../data/tarotCards.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Flag to use local data only (set to true to skip API calls entirely)
const USE_LOCAL_DATA = true;

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000 // 5 second timeout
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Public API (no auth required)
export const api = {
    // Envelopes
    async fetchEnvelopes() {
        // Use local data if flag is set or as fallback
        if (USE_LOCAL_DATA) {
            console.log('📦 Loading envelopes from local data');
            return localEnvelopes;
        }

        try {
            const { data } = await apiClient.get('/envelopes');
            return data;
        } catch (error) {
            console.warn('⚠️ API unavailable, using local envelope data:', error.message);
            return localEnvelopes;
        }
    },

    async fetchEnvelope(id) {
        // Use local data if flag is set or as fallback
        if (USE_LOCAL_DATA) {
            const envelope = localEnvelopes.find(e => e.id === id);
            return envelope || null;
        }

        try {
            const { data } = await apiClient.get(`/envelopes/${id}`);
            return data;
        } catch (error) {
            console.warn('⚠️ API unavailable, using local envelope data:', error.message);
            const envelope = localEnvelopes.find(e => e.id === id);
            return envelope || null;
        }
    },

    // Password verification is done locally in PasswordPrompt.jsx
    // This method is kept for compatibility but uses local data
    async verifyPassword(envelopeId, password) {
        const envelope = localEnvelopes.find(e => e.id === envelopeId);
        return envelope && envelope.password === password;
    },

    // Tarot
    async fetchTarotCards() {
        // Convert object to array format
        const cardsArray = Object.values(localTarotCards);

        if (USE_LOCAL_DATA) {
            console.log('🃏 Loading tarot cards from local data');
            return cardsArray;
        }

        try {
            const { data } = await apiClient.get('/tarot');
            return data;
        } catch (error) {
            console.warn('⚠️ API unavailable, using local tarot data:', error.message);
            return cardsArray;
        }
    },

    async fetchRandomTarotCard() {
        // Convert object to array for random selection
        const cardsArray = Object.values(localTarotCards);

        if (USE_LOCAL_DATA) {
            const randomIndex = Math.floor(Math.random() * cardsArray.length);
            return cardsArray[randomIndex];
        }

        try {
            const { data } = await apiClient.get('/tarot/random/pick');
            return data;
        } catch (error) {
            console.warn('⚠️ API unavailable, picking random local tarot card:', error.message);
            const randomIndex = Math.floor(Math.random() * cardsArray.length);
            return cardsArray[randomIndex];
        }
    }
};

// Admin API (auth required)
export const adminApi = {
    // Auth
    async login(username, password) {
        const { data } = await apiClient.post('/auth/login', { username, password });
        if (data.token) {
            localStorage.setItem('admin_token', data.token);
        }
        return data;
    },

    async verifyToken() {
        try {
            const { data } = await apiClient.get('/auth/verify');
            return data.valid;
        } catch {
            return false;
        }
    },

    logout() {
        localStorage.removeItem('admin_token');
    },

    // Envelopes
    async updateEnvelope(id, envelopeData) {
        const { data } = await apiClient.put(`/envelopes/${id}`, envelopeData);
        return data;
    },

    async createEnvelope(envelopeData) {
        const { data } = await apiClient.post('/envelopes', envelopeData);
        return data;
    },

    async deleteEnvelope(id) {
        const { data } = await apiClient.delete(`/envelopes/${id}`);
        return data;
    },

    // Uploads
    async uploadMusic(envelopeId, file) {
        const formData = new FormData();
        formData.append('music', file);
        const { data } = await apiClient.post(`/upload/music/${envelopeId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    async uploadMemory(envelopeId, file) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await apiClient.post(`/upload/memory/${envelopeId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    async deleteMemory(envelopeId, imageUrl) {
        const { data } = await apiClient.delete(`/upload/memory/${envelopeId}`, {
            data: { imageUrl }
        });
        return data;
    },

    async uploadStamp(envelopeId, file) {
        const formData = new FormData();
        formData.append('stamp', file);
        const { data } = await apiClient.post(`/upload/stamp/${envelopeId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    async uploadTarotImage(cardId, file) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await apiClient.post(`/upload/tarot/${cardId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    // Tarot
    async updateTarotCard(id, cardData) {
        const { data } = await apiClient.put(`/tarot/${id}`, cardData);
        return data;
    }
};

export default api;
