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

  // Remove focus from React Flow nodes when dialog opens
  // This runs synchronously when open changes to true, before Dialog renders
  useEffect(() => {
    if (open) {
      // Remove focus immediately, synchronously, before Dialog sets aria-hidden
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && (
        activeElement.classList.contains('react-flow__node') ||
        activeElement.closest('.react-flow__node') ||
        activeElement.closest('.react-flow')
      )) {
        activeElement.blur();
      }
      
      // Remove focus from all React Flow nodes
      const allNodes = document.querySelectorAll('.react-flow__node');
      allNodes.forEach(node => {
        (node as HTMLElement).blur();
        (node as HTMLElement).classList.remove('selected');
      });
      
      // Remove focus from handles
      const handles = document.querySelectorAll('.react-flow__handle');
      handles.forEach(handle => {
        (handle as HTMLElement).blur();
      });
      
      // Remove focus from any Select native inputs
      const selectInputs = document.querySelectorAll('.MuiSelect-nativeInput');
      selectInputs.forEach(input => {
        (input as HTMLElement).blur();
      });
      
      // Force focus to body to ensure nothing has focus
      // This must happen before Dialog renders
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    }
  }, [open]);

  // Handle focus management when dialog fully opens
  const handleDialogEntered = () => {
    // Wait for Dialog to fully render and remove aria-hidden before focusing
    // Use multiple requestAnimationFrame to ensure Dialog's aria-hidden is removed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Remove focus from any Select native inputs that might have auto-focused
        const selectInputs = document.querySelectorAll('.MuiSelect-nativeInput');
        selectInputs.forEach(input => {
          (input as HTMLElement).blur();
        });
        
        // Focus the first input in the dialog after it's fully rendered
        setTimeout(() => {
          if (selectRef.current) {
            // Try to focus the select button instead of the native input
            const selectButton = selectRef.current.querySelector('[role="button"]') as HTMLElement;
            if (selectButton) {
              selectButton.focus();
            } else {
              // Fallback to input if button not found
              const input = selectRef.current.querySelector('input') as HTMLElement;
              if (input && !input.classList.contains('MuiSelect-nativeInput')) {
                input.focus();
              }
            }
          }
        }, 200);
      });
    });
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
    console.log('handleSubmit called', e);
    e.preventDefault();
    e.stopPropagation();
    
    // Validate required fields
    if (!formData.type || !formData.position) {
      alert('Please fill in all required fields (Type and Position)');
      return;
    }
    
    console.log('Submitting form with data:', formData);
    console.log('onSubmit function:', onSubmit);
    
    try {
      const result = onSubmit(formData);
      if (result instanceof Promise) {
        await result;
      }
      console.log('Form submitted successfully');
      // Close the dialog after successful submission
      onClose();
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

  const handleDialogClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick') => {
    // Remove focus from dialog when closing
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.closest('[role="dialog"]')) {
        activeElement.blur();
      }
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose} 
      maxWidth="sm" 
      fullWidth
      disableEnforceFocus={false}
      disableAutoFocus={true}
      TransitionProps={{
        onEntered: handleDialogEntered
      }}
      PaperProps={{
        onMouseDown: (e) => {
          // Prevent focus from going back to React Flow when clicking in dialog
          e.stopPropagation();
        }
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
                autoFocus={false}
                MenuProps={{
                  disableAutoFocus: true,
                  disableEnforceFocus: true
                }}
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            onClick={(e) => {
              console.log('Add button clicked');
              // Let the form handle the submit
            }}
          >
            {initialData._id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 