export interface Protein {
  _id: string;
  name: string;
  uniprotId: string;
  pathway: 'HR' | 'NHEJ' | 'MR';
  description: string;
  function: string;
  interactions: string[];
  recruitmentTime?: number;
} 