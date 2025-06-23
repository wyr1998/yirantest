import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import type { Protein } from '../types';
import { proteinApi } from '../services/api';

interface ProteinFormState {
  name: string;
  uniprotId: string;
  modification?: string;
  pathways: ('HR' | 'NHEJ' | 'MR')[];
  description: string;
  function: string;
  interactions: string[];
  recruitmentTime?: number;
}

const ProteinForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [protein, setProtein] = useState<Partial<ProteinFormState>>({
    name: '',
    uniprotId: '',
    modification: '',
    pathways: [],
    description: '',
    function: '',
    interactions: [],
    recruitmentTime: undefined
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
  const fetchProtein = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching protein with ID:', id);
      const data = await proteinApi.getOne(id!);
          setProtein({
            ...data,
            pathways: Array.isArray(data.pathways)
              ? (data.pathways.filter((p: any) => !!p) as ('HR' | 'NHEJ' | 'MR')[])
              : (data.pathways ? [data.pathways] : [])
          });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch protein';
      console.error('Error details:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
      fetchProtein();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const proteinToSave = {
        ...protein,
        pathways: Array.isArray(protein.pathways)
          ? (protein.pathways.filter((p: any) => !!p) as ('HR' | 'NHEJ' | 'MR')[])
          : (protein.pathways ? [protein.pathways] : [])
      };
      if (isEditMode) {
        await proteinApi.update(id!, proteinToSave);
      } else {
        await proteinApi.create(proteinToSave as Omit<Protein, '_id'>);
      }
      navigate('/dna-repair/proteins');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save protein';
      setError(errorMessage);
      console.error('Error saving protein:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProtein(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Protein' : 'Add New Protein'}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Container 
            sx={{ 
              maxHeight: '70vh', 
              overflowY: 'auto',
              px: 2,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
                '&:hover': {
                  background: '#555',
                },
              },
            }}
          >
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={protein.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="UniProt ID"
              name="uniprotId"
              value={protein.uniprotId}
              onChange={handleChange}
              margin="normal"
              required
              helperText="e.g., P62805 for Histone H4"
            />
            <TextField
              fullWidth
              label="Modification"
              name="modification"
              value={protein.modification}
              onChange={handleChange}
              margin="normal"
              helperText="e.g., K20me3 for trimethylation at lysine 20"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Pathways</InputLabel>
              <Select
                name="pathways"
                multiple
                value={protein.pathways || []}
                onChange={(e) => {
                  const value = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                  setProtein(prev => ({ ...prev, pathways: value as ('HR' | 'NHEJ' | 'MR')[] }));
                }}
                required
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="NHEJ">NHEJ</MenuItem>
                <MenuItem value="MR">MR</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={protein.description}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Function"
              name="function"
              value={protein.function}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Interactions (comma-separated)"
              name="interactions"
              value={protein.interactions?.join(', ')}
              onChange={(e) => setProtein(prev => ({
                ...prev,
                interactions: e.target.value.split(',').map(s => s.trim())
              }))}
              margin="normal"
              helperText="Enter protein names separated by commas"
            />
            <TextField
              fullWidth
              label="Recruitment Time (optional)"
              name="recruitmentTime"
              type="number"
              value={protein.recruitmentTime || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Container>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/proteins')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Create')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProteinForm; 