import { ProteinModification } from '../types';
import { api } from './api';

export const proteinModificationService = {
  // 获取特定蛋白质的所有修饰
  async getByProteinId(proteinId: string): Promise<ProteinModification[]> {
    const response = await api.get(`/protein-modifications/protein/${proteinId}`);
    return response.data;
  },

  // 创建新的蛋白修饰
  async create(proteinId: string, data: Omit<ProteinModification, '_id' | 'proteinId' | 'createdAt' | 'updatedAt'>): Promise<ProteinModification> {
    const response = await api.post(`/protein-modifications/protein/${proteinId}`, data);
    return response.data;
  },

  // 更新蛋白修饰
  async update(id: string, data: Partial<ProteinModification>): Promise<ProteinModification> {
    const response = await api.put(`/protein-modifications/${id}`, data);
    return response.data;
  },

  // 删除蛋白修饰
  async delete(id: string): Promise<void> {
    await api.delete(`/protein-modifications/${id}`);
  },
}; 