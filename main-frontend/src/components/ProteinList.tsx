import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Protein } from '../types';
import { proteinApi } from '../services/api';

const ProteinList: React.FC = () => {
  const [proteins, setProteins] = useState<Protein[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [proteinToDelete, setProteinToDelete] = useState<Protein | null>(null);

  useEffect(() => {
    fetchProteins();
  }, []);

  const fetchProteins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proteinApi.getAll();
      console.log('Fetched proteins:', data);
      setProteins(data);
    } catch (error) {
      setError('Failed to fetch proteins');
      console.error('Error fetching proteins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (protein: Protein) => {
    setProteinToDelete(protein);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!proteinToDelete) return;

    try {
      setLoading(true);
      setError(null);
      await proteinApi.delete(proteinToDelete._id);
      await fetchProteins(); // Refresh the list
      setDeleteDialogOpen(false);
      setProteinToDelete(null);
    } catch (error) {
      setError('Failed to delete protein');
      console.error('Error deleting protein:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProteinToDelete(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        DNA Repair Proteins
      </Typography>
      <Button 
        component={Link} 
        to="/dna-repair/proteins/new" 
        variant="contained" 
        color="primary" 
        sx={{ mb: 2 }}
      >
        Add New Protein
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>UniProt ID</TableCell>
              <TableCell>Pathway</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Function</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proteins.map((protein) => (
              <TableRow key={protein._id}>
                <TableCell>{protein.name}</TableCell>
                <TableCell>{protein.uniprotId}</TableCell>
                <TableCell>{protein.pathways?.join(', ')}</TableCell>
                <TableCell>{protein.description}</TableCell>
                <TableCell>{protein.function}</TableCell>
                <TableCell>
                  <Button 
                    component={Link} 
                    to={`/dna-repair/proteins/${protein._id}`}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button 
                    component={Link} 
                    to={`/dna-repair/proteins/${protein._id}/edit`}
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => console.log('Editing protein:', protein)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(protein)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {proteinToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProteinList; 