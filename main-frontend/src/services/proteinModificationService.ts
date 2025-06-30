import { ProteinModification } from '../types';
import { API_BASE_URL } from './api';

export const proteinModificationService = {
  // 获取特定蛋白质的所有修饰
  async getByProteinId(proteinId: string): Promise<ProteinModification[]> {
    const response = await fetch(`${API_BASE_URL}/protein-modifications/protein/${proteinId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch protein modifications');
    }
    return response.json();
  },

  // 创建新的蛋白修饰
  async create(proteinId: string, data: Omit<ProteinModification, '_id' | 'proteinId' | 'createdAt' | 'updatedAt'>): Promise<ProteinModification> {
    const response = await fetch(`${API_BASE_URL}/protein-modifications/protein/${proteinId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create protein modification');
    }
    return response.json();
  },

  // 更新蛋白修饰
  async update(id: string, data: Partial<ProteinModification>): Promise<ProteinModification> {
    const response = await fetch(`${API_BASE_URL}/protein-modifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update protein modification');
    }
    return response.json();
  },

  // 删除蛋白修饰
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/protein-modifications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete protein modification');
    }
  },
}; 