import { ProteinPosition, ProteinPositions } from '../types';

const API_BASE_URL = '/api';

export const proteinPositionService = {
  // Get all protein positions for a pathway
  getProteinPositions: async (pathway: 'HR' | 'NHEJ'): Promise<ProteinPositions> => {
    try {
      const response = await fetch(`${API_BASE_URL}/protein-positions/${pathway}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to fetch protein positions: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching protein positions:', error);
      return {};
    }
  },

  // Save multiple protein positions for a pathway
  saveProteinPositions: async (pathway: 'HR' | 'NHEJ', positions: ProteinPositions): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/protein-positions/${pathway}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positions }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to save protein positions: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
    } catch (error) {
      console.error('Error saving protein positions:', error);
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
      const response = await fetch(`${API_BASE_URL}/protein-positions/${pathway}/${proteinId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to update protein position: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
    } catch (error) {
      console.error('Error updating protein position:', error);
      throw error;
    }
  },

  // Reset all positions for a pathway
  resetPathwayPositions: async (pathway: 'HR' | 'NHEJ'): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/protein-positions/${pathway}/reset`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to reset pathway positions: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
    } catch (error) {
      console.error('Error resetting pathway positions:', error);
      throw error;
    }
  }
}; 