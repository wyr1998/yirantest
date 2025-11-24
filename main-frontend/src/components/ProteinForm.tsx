import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Collapse,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore, ExpandLess } from '@mui/icons-material';
import { Protein, ProteinInteraction } from '../types';
import { proteinApi } from '../services/api';
import { proteinModificationService } from '../services/proteinModificationService';

interface ProteinFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Protein, '_id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Protein>;
}

export const ProteinForm: React.FC<ProteinFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<Omit<Protein, '_id' | 'createdAt' | 'updatedAt'>>({
    name: initialData.name || '',
    uniprotId: initialData.uniprotId || '',
    function: initialData.function || '',
    description: initialData.description || '',
    pathway: initialData.pathway || 'HR',
    interactions: initialData.interactions || []
  });

  const [availableProteins, setAvailableProteins] = useState<Protein[]>([]);
  const [expandedInteractions, setExpandedInteractions] = useState<boolean[]>([]);
  const [proteinModifications, setProteinModifications] = useState<{[key: string]: any[]}>({});

  useEffect(() => {
    loadAvailableProteins();
  }, []);

  // Remove focus from buttons and React Flow nodes when dialog opens
  useEffect(() => {
    if (open) {
      // Remove focus immediately, synchronously, before Dialog sets aria-hidden
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
      
      // Remove focus from all buttons
      const buttons = document.querySelectorAll('.MuiButtonBase-root, .MuiButton-root, .MuiMenuItem-root');
      buttons.forEach(button => {
        (button as HTMLElement).blur();
      });
      
      // Remove focus from all React Flow nodes (if any)
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
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    }
  }, [open]);

  const loadAvailableProteins = async () => {
        try {
      const proteins = await proteinApi.getAll();
      setAvailableProteins(proteins);
        } catch (error) {
      console.error('Failed to load proteins:', error);
    }
  };

  const loadProteinModifications = async (proteinId: string) => {
    try {
      const modifications = await proteinModificationService.getByProteinId(proteinId);
      setProteinModifications(prev => ({
        ...prev,
        [proteinId]: modifications
      }));
    } catch (error) {
      console.error('Failed to load modifications:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInteractionChange = (index: number, field: keyof ProteinInteraction, value: any) => {
    const newInteractions = [...formData.interactions];
    if (field === 'targetModification') {
      // 处理targetModification对象
      newInteractions[index] = {
        ...newInteractions[index],
        targetModification: value ? {
          position: value.position || '',
          type: value.type || ''
        } : undefined
      };
    } else {
    newInteractions[index] = {
      ...newInteractions[index],
      [field]: value
    };
    }
    setFormData(prev => ({
      ...prev,
      interactions: newInteractions
    }));

    // 如果选择了新的目标蛋白，加载其修饰信息
    if (field === 'targetId') {
      loadProteinModifications(value);
    }
  };

  const addInteraction = () => {
    setFormData(prev => ({
      ...prev,
      interactions: [...prev.interactions, { targetId: '', type: '', description: '' }]
    }));
    setExpandedInteractions(prev => [...prev, true]);
  };

  const removeInteraction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interactions: prev.interactions.filter((_, i) => i !== index)
    }));
    setExpandedInteractions(prev => prev.filter((_, i) => i !== index));
  };

  const toggleInteraction = (index: number) => {
    setExpandedInteractions(prev => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
      maxWidth="md" 
      fullWidth
      disableEnforceFocus={false}
      disableAutoFocus={true}
    >
        <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData._id ? 'Edit Protein' : 'Add New Protein'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              label="Protein Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="UniProt ID"
              name="uniprotId"
              value={formData.uniprotId}
              onChange={handleChange}
              required
              fullWidth
            />
            </Box>
            <TextField
              label="Function"
              name="function"
              value={formData.function}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              select
              label="Pathway"
              name="pathway"
              value={formData.pathway}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="NHEJ">NHEJ</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </TextField>
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Interactions
                <IconButton size="small" onClick={addInteraction} sx={{ ml: 1 }}>
                  <AddIcon />
                </IconButton>
              </Typography>
              {formData.interactions.map((interaction, index) => (
                <Box key={index} sx={{ mb: 2, border: '1px solid #e0e0e0', p: 2, borderRadius: 2, bgcolor: 'white', boxShadow: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconButton size="small" onClick={() => toggleInteraction(index)}>
                      {expandedInteractions[index] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1, ml: 1 }}>
                      Interaction {index + 1}
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => removeInteraction(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Collapse in={expandedInteractions[index]}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
                      <FormControl fullWidth>
                        <InputLabel>Target Protein</InputLabel>
                        <Select
                          value={interaction.targetId}
                          label="Target Protein"
                          onChange={e => handleInteractionChange(index, 'targetId', e.target.value)}
                        >
                          {availableProteins.map(p => (
                            <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <TextField
                        select
                        label="Type"
                        value={interaction.type}
                        onChange={e => handleInteractionChange(index, 'type', e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="activation">Activation</MenuItem>
                        <MenuItem value="inhibition">Inhibition</MenuItem>
                        <MenuItem value="binding">Binding</MenuItem>
                        <MenuItem value="modification">Modification</MenuItem>
                      </TextField>
                    </Box>
                    <TextField
                      label="Description"
                      value={interaction.description}
                      onChange={e => handleInteractionChange(index, 'description', e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                    />
                    {interaction.targetId && proteinModifications[interaction.targetId] && proteinModifications[interaction.targetId].length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                          <InputLabel>Target Modification (Optional)</InputLabel>
                          <Select
                            value={interaction.targetModification ? `${interaction.targetModification.type}-${interaction.targetModification.position}` : ''}
                            label="Target Modification (Optional)"
                            onChange={e => {
                              const value = e.target.value;
                              if (value) {
                                const [type, position] = value.split('-');
                                handleInteractionChange(index, 'targetModification', { type, position });
                              } else {
                                handleInteractionChange(index, 'targetModification', null);
                              }
                            }}
                          >
                            <MenuItem value="">None</MenuItem>
                            {proteinModifications[interaction.targetId].map((mod: any) => (
                              <MenuItem key={mod._id} value={`${mod.type}-${mod.position}`}>
                                {mod.type} at {mod.position}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                  </Collapse>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 2, justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData._id ? 'Save Changes' : 'Add Protein'}
          </Button>
        </DialogActions>
        </form>
    </Dialog>
  );
};