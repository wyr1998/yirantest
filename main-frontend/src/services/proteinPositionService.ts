import { ProteinPosition, ProteinPositions } from '../types';
import { api } from './api';

export const proteinPositionService = {
  // Get all protein positions for a pathway
  getProteinPositions: async (pathway: 'HR' | 'NHEJ'): Promise<ProteinPositions> => {
    try {
      const response = await api.get(`/protein-positions/${pathway}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching protein positions:', error);
      return {};
    }
  },

  // Save multiple protein positions for a pathway
  saveProteinPositions: async (pathway: 'HR' | 'NHEJ', positions: ProteinPositions): Promise<void> => {
    try {
      await api.post(`/protein-positions/${pathway}`, { positions });
    } catch (error: any) {
      console.error('Error saving protein positions:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication required. Please log in as admin to save protein positions.');
      }
      throw error;
    }
  },

  // Update a single protein position
  updateProteinPosition: async (
    pathway: 'HR' | 'NHEJ', 
    proteinId: string, 
    position: ProteinPosition
  ): Promise<void> => {
    try {
      await api.put(`/protein-positions/${pathway}/${proteinId}`, { position });
    } catch (error: any) {
      console.error('Error updating protein position:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication required. Please log in as admin to update protein positions.');
      }
      throw error;
    }
  },

  // Reset all positions for a pathway
  resetPathwayPositions: async (pathway: 'HR' | 'NHEJ'): Promise<void> => {
    try {
      await api.delete(`/protein-positions/${pathway}/reset`);
    } catch (error: any) {
      console.error('Error resetting pathway positions:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication required. Please log in as admin to reset pathway positions.');
      }
      throw error;
    }
  }
}; 