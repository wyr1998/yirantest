import { Protein } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const proteinApi = {
  // Get all proteins
  getAll: async (): Promise<Protein[]> => {
    const response = await fetch(`${API_BASE_URL}/proteins`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Failed to fetch proteins: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }
    return response.json();
  },

  // Get a single protein
  getOne: async (id: string): Promise<Protein> => {
    console.log('API: Fetching protein with ID:', id);
    const response = await fetch(`${API_BASE_URL}/proteins/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Failed to fetch protein: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }
    const data = await response.json();
    console.log('API: Received protein data:', data);
    return data;
  },

  // Create a new protein
  create: async (protein: Omit<Protein, '_id'>): Promise<Protein> => {
    const response = await fetch(`${API_BASE_URL}/proteins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(protein),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Failed to create protein: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }
    return response.json();
  },

  // Update a protein
  update: async (id: string, protein: Partial<Protein>): Promise<Protein> => {
    const response = await fetch(`${API_BASE_URL}/proteins/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(protein),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Failed to update protein: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }
    return response.json();
  },

  // Delete a protein
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/proteins/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Failed to delete protein: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }
  }
}; 