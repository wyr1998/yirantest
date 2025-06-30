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
    newInteractions[index] = {
      ...newInteractions[index],
      [field]: value
    };
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData._id ? 'Edit Protein' : 'Add New Protein'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Interactions
                <IconButton size="small" onClick={addInteraction} sx={{ ml: 1 }}>
                  <AddIcon />
                </IconButton>
              </Typography>

              {formData.interactions.map((interaction, index) => (
                <Box key={index} sx={{ mb: 2, border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconButton size="small" onClick={() => toggleInteraction(index)}>
                      {expandedInteractions[index] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Typography variant="subtitle2">Interaction {index + 1}</Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => removeInteraction(index)}
                      sx={{ ml: 'auto' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Collapse in={expandedInteractions[index]}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Target Protein</InputLabel>
                        <Select
                          value={interaction.targetId}
                          onChange={(e) => handleInteractionChange(index, 'targetId', e.target.value)}
                          label="Target Protein"
                          required
                        >
                          {availableProteins
                            .filter(p => p._id !== initialData._id)
                            .map(protein => (
                              <MenuItem key={protein._id} value={protein._id}>
                                {protein.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>

            <TextField
                        label="Interaction Type"
                        value={interaction.type || ''}
                        onChange={(e) => handleInteractionChange(index, 'type', e.target.value)}
              fullWidth
                        placeholder="Optional: e.g., binds, phosphorylates, etc."
                      />

                      {interaction.targetId && proteinModifications[interaction.targetId] && (
                        <FormControl fullWidth>
                          <InputLabel>Target Modification</InputLabel>
                          <Select
                            value={interaction.targetModification ? 
                              `${interaction.targetModification.type}-${interaction.targetModification.position}` : 
                              ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value) {
                                const [type, position] = value.split('-');
                                handleInteractionChange(index, 'targetModification', { type, position });
                              } else {
                                handleInteractionChange(index, 'targetModification', undefined);
                              }
                            }}
                            label="Target Modification"
                          >
                            <MenuItem value="">None</MenuItem>
                            {proteinModifications[interaction.targetId].map(mod => (
                              <MenuItem 
                                key={`${mod.type}-${mod.position}`} 
                                value={`${mod.type}-${mod.position}`}
            >
                                {mod.type} at {mod.position}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      <TextField
                        label="Description"
                        value={interaction.description || ''}
                        onChange={(e) => handleInteractionChange(index, 'description', e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        placeholder="Optional: Add details about this interaction"
                      />
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </Box>
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