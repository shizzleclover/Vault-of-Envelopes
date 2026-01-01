import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
        const { data } = await apiClient.get('/envelopes');
        return data;
    },

    async fetchEnvelope(id) {
        const { data } = await apiClient.get(`/envelopes/${id}`);
        return data;
    },

    async verifyPassword(envelopeId, password) {
        const { data } = await apiClient.post(`/envelopes/${envelopeId}/verify-password`, { password });
        return data.valid;
    },

    // Tarot
    async fetchTarotCards() {
        const { data } = await apiClient.get('/tarot');
        return data;
    },

    async fetchRandomTarotCard() {
        const { data } = await apiClient.get('/tarot/random/pick');
        return data;
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
