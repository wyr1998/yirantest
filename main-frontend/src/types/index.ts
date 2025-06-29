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

export * from './protein'; 