console.log("API URL =", process.env.REACT_APP_API_URL);
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Gig API
export const gigAPI = {
  getAllGigs: (params) => api.get('/gigs', { params }),
  getGig: (id) => api.get(`/gigs/${id}`),
  createGig: (data) => api.post('/gigs', data),
  updateGig: (id, data) => api.put(`/gigs/${id}`, data),
  deleteGig: (id) => api.delete(`/gigs/${id}`),
  getMyGigs: () => api.get('/gigs/my-gigs'),
};

// Bid API
export const bidAPI = {
  createBid: (data) => api.post('/bids', data),
  getGigBids: (gigId) => api.get(`/bids/gig/${gigId}`),
  getMyBids: () => api.get('/bids/my-bids'),
  updateBid: (id, data) => api.put(`/bids/${id}`, data),
  acceptBid: (id) => api.put(`/bids/${id}/accept`),
  rejectBid: (id) => api.put(`/bids/${id}/reject`),
};

export default api;
