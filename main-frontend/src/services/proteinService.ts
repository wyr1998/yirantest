import { Protein } from '../types';

const API_BASE_URL = '/api';

export const proteinService = {
  async getAllProteins(): Promise<Protein[]> {
    const response = await fetch(`${API_BASE_URL}/proteins`);
    if (!response.ok) {
      throw new Error('Failed to fetch proteins');
    }
    return response.json();
  },

  async getProteinsByPathway(pathway: 'HR' | 'NHEJ' | 'MR'): Promise<Protein[]> {
    const response = await fetch(`${API_BASE_URL}/proteins/pathway/${pathway}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${pathway} proteins`);
    }
    return response.json();
  }
}; 