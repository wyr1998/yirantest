import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box
} from '@mui/material';
import { ProteinModification } from '../types';

interface ProteinModificationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProteinModification, '_id' | 'proteinId' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<ProteinModification>;
}

const MODIFICATION_TYPES = [
  'Phosphorylation',
  'Methylation',
  'Acetylation',
  'Ubiquitination',
  'SUMOylation',
  'Glycosylation',
  'Other'
];

export const ProteinModificationForm: React.FC<ProteinModificationFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = {}
}) => {
  const [formData, setFormData] = useState({
    type: initialData.type || '',
    position: initialData.position || '',
    description: initialData.description || '',
    effect: initialData.effect || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData._id ? 'Edit Protein Modification' : 'Add Protein Modification'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              select
              label="Modification Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              fullWidth
            >
              {MODIFICATION_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              fullWidth
              placeholder="e.g., S123, T456"
              helperText="Enter the amino acid and position number"
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Effect"
              name="effect"
              value={formData.effect}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              placeholder="Describe the effect of this modification"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData._id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 