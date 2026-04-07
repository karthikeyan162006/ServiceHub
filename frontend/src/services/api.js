import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const userService = {
    requestOtp: (emailData) => api.post('/users/request-otp', emailData),
    register: (userData) => api.post('/users/register', userData),
    forgotPassword: (emailData) => api.post('/users/forgot-password', emailData),
    resetPassword: (resetData) => api.post('/users/reset-password', resetData),
    login: (credentials) => api.post('/users/login', credentials),
    getUser: (id) => api.get(`/users/${id}`),
};

export const providerService = {
    add: (providerData) => api.post('/providers/add', providerData),
    getAll: (serviceType, location) => {
        let url = '/providers';
        const params = [];
        if (serviceType) params.push(`serviceType=${serviceType}`);
        if (location) params.push(`location=${location}`);
        if (params.length > 0) url += `?${params.join('&')}`;
        return api.get(url);
    },
    getByType: (type) => api.get(`/providers/service/${type}`),
    getById: (id) => api.get(`/providers/${id}`),
    getByUserId: (userId) => api.get(`/providers/user/${userId}`),
};

export const bookingService = {
    create: (bookingData) => api.post('/bookings', bookingData),
    getByUser: (userId) => api.get(`/bookings/user/${userId}`),
    getByProvider: (providerId) => api.get(`/bookings/provider/${providerId}`),
    updateStatus: (id, status) => api.put(`/bookings/${id}`, { status }),
};

export const reviewService = {
    add: (reviewData) => api.post('/reviews', reviewData),
    getByProvider: (providerId) => api.get(`/reviews/provider/${providerId}`),
};

export default api;
