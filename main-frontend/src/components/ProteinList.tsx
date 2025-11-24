import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Protein } from '../types';
import { proteinApi } from '../services/api';
import { authService } from '../services/authService';

const ProteinList: React.FC = () => {
  const [proteins, setProteins] = useState<Protein[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [proteinToDelete, setProteinToDelete] = useState<Protein | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchProteins();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await authService.verifyToken();
      setIsAdmin(!!user);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const fetchProteins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proteinApi.getAll();
      setProteins(data);
    } catch (error) {
      setError('Failed to fetch proteins');
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
      await fetchProteins();
      setDeleteDialogOpen(false);
      setProteinToDelete(null);
    } catch (error) {
      setError('Failed to delete protein');
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
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>
        DNA Repair Proteins
      </Typography>
      {isAdmin && (
        <Button 
          component={Link} 
          to="/dna-repair/proteins/new" 
          variant="contained" 
          color="primary" 
          sx={{ mb: 2 }}
          onMouseDown={(e) => {
            // Prevent focus on mousedown to avoid aria-hidden warning
            e.preventDefault();
          }}
          onClick={(e) => {
            // Remove focus before navigation
            (e.currentTarget as HTMLElement).blur();
          }}
        >
          Add New Protein
        </Button>
      )}
      <Grid container spacing={3}>
            {proteins.map((protein) => (
          <Grid item xs={12} sm={6} md={4} key={protein._id}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} mb={1}>
                  <Chip label={protein.pathway} color="primary" size="small" />
                  {protein.uniprotId && <Chip label={protein.uniprotId} size="small" />}
                </Stack>
                <Typography variant="h6" component="div" gutterBottom>
                  {protein.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                  {protein.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Function:</strong> {protein.function}
                </Typography>
              </CardContent>
              <CardActions>
                  <Button 
                    component={Link} 
                    to={`/dna-repair/proteins/${protein._id}`}
                    size="small"
                  >
                    View
                  </Button>
                  {isAdmin && (
                    <>
                      <Button 
                        component={Link} 
                        to={`/dna-repair/proteins/${protein._id}/edit`}
                        size="small"
                        color="primary"
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
                    </>
                  )}
              </CardActions>
            </Card>
          </Grid>
            ))}
      </Grid>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
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