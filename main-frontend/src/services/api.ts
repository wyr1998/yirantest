import axios from 'axios';
import { Protein } from '../types';

export const API_BASE_URL = '/api';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUsername');
    }
    return Promise.reject(error);
  }
);

export const proteinApi = {
  // Get all proteins
  getAll: async (): Promise<Protein[]> => {
    const response = await api.get('/proteins');
    return response.data;
  },

  // Get a single protein
  getOne: async (id: string): Promise<Protein> => {
    console.log('API: Fetching protein with ID:', id);
    const response = await api.get(`/proteins/${id}`);
    console.log('API: Received protein data:', response.data);
    return response.data;
  },

  // Create a new protein
  create: async (protein: Omit<Protein, '_id'>): Promise<Protein> => {
    const response = await api.post('/proteins', protein);
    return response.data;
  },

  // Update a protein
  update: async (id: string, protein: Partial<Protein>): Promise<Protein> => {
    const response = await api.put(`/proteins/${id}`, protein);
    return response.data;
  },

  // Delete a protein
  delete: async (id: string): Promise<void> => {
    await api.delete(`/proteins/${id}`);
  }
}; 