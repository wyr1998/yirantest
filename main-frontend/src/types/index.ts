export interface Protein {
  _id: string;
  name: string;
  uniprotId: string;
  modification?: string;
  pathway: 'HR' | 'NHEJ' | 'MR';
  description: string;
  function: string;
  interactions: string[];
  createdAt: string;
  updatedAt: string;
}

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