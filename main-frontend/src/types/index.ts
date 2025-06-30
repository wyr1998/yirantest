import type { Protein } from './protein';

export interface ProteinNode {
  id: string;
  type: 'protein';
  data: Protein;
  position: { x: number; y: number };
}

export interface ProteinPosition {
  x: number;
  y: number;
}

export interface ProteinPositions {
  [proteinId: string]: ProteinPosition;
}

export interface ProteinModification {
  _id: string;
  proteinId: string;
  type: string;
  position: string;
  description?: string;
  effect?: string;
  createdAt: string;
  updatedAt: string;
}

export * from './protein'; 
export * from './blog'; 