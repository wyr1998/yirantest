export interface ProteinInteraction {
  targetId: string;
  type?: string;
  description?: string;
  targetModification?: {
    position: string;
    type: string;
  };
}

export interface Protein {
  _id: string;
  name: string;
  uniprotId: string;
  function?: string;
  description?: string;
  pathway: 'HR' | 'NHEJ' | 'Both';
  interactions: ProteinInteraction[];
  createdAt: string;
  updatedAt: string;
} 