import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { ProteinModification } from '../types';

interface ProteinModificationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProteinModification, '_id' | 'proteinId' | 'createdAt' | 'updatedAt'>) => Promise<void> | void;
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
  const selectRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    type: initialData.type || '',
    position: initialData.position || '',
    description: initialData.description || '',
    effect: initialData.effect || ''
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        type: initialData.type || '',
        position: initialData.position || '',
        description: initialData.description || '',
        effect: initialData.effect || ''
      });
    }
  }, [open, initialData]);

  // Handle focus management when dialog opens
  const handleDialogEntered = () => {
    // Remove focus from React Flow nodes to fix aria-hidden warning
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (
      activeElement.classList.contains('react-flow__node') ||
      activeElement.closest('.react-flow__node')
    )) {
      activeElement.blur();
    }
    
    // Focus the first input in the dialog
    setTimeout(() => {
      if (selectRef.current) {
        const input = selectRef.current.querySelector('input') as HTMLElement;
        if (input) {
          input.focus();
        }
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate required fields
    if (!formData.type || !formData.position) {
      alert('Please fill in all required fields (Type and Position)');
      return;
    }
    
    console.log('Submitting form with data:', formData);
    
    try {
      const result = onSubmit(formData);
      if (result instanceof Promise) {
        await result;
      }
      console.log('Form submitted successfully');
      // Reset form after successful submit (only if not editing)
      if (!initialData._id) {
        setFormData({
          type: '',
          position: '',
          description: '',
          effect: ''
        });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save modification. Please try again.';
      alert(`Error: ${errorMessage}`);
      // Don't close dialog on error
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      TransitionProps={{
        onEntered: handleDialogEntered
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData._id ? 'Edit Protein Modification' : 'Add Protein Modification'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required ref={selectRef}>
              <InputLabel>Modification Type</InputLabel>
              <Select
                value={formData.type}
                onChange={handleSelectChange}
                label="Modification Type"
              >
                {MODIFICATION_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
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