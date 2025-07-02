import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Protein } from '../types';
import { proteinApi } from '../services/api';
import { Box, Card, CardContent, Typography, Chip, Stack, Button, Divider } from '@mui/material';

const ProteinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [protein, setProtein] = useState<Protein | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProteins, setAllProteins] = useState<Protein[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    proteinApi.getOne(id)
      .then(setProtein)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    proteinApi.getAll().then(setAllProteins);
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ color: 'red', p: 4 }}>{error}</Box>;
  if (!protein) return <Box sx={{ p: 4 }}>Protein not found.</Box>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: { xs: 1, sm: 3 } }}>
      <Card elevation={3}>
        <CardContent>
          <Stack direction="row" spacing={1} mb={2} alignItems="center">
            <Typography variant="h5" color="primary" fontWeight={700} sx={{ flexGrow: 1 }}>
              {protein.name}
            </Typography>
            <Chip label={protein.pathway} color="primary" size="small" />
            <Chip label={protein.uniprotId} size="small" />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Description</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {protein.description || 'No description.'}
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Function</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {protein.function || 'No function info.'}
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Interactions</Typography>
          {protein.interactions?.length === 0 ? (
            <Typography variant="body2" color="text.secondary">None</Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {protein.interactions?.map((interaction, idx) => {
            const target = allProteins.find(p => p._id === interaction.targetId);
                return (
                  <Chip
                    key={idx}
                    label={`${interaction.type || 'Interaction'} → ${target ? target.name : interaction.targetId}`}
                    variant="outlined"
                    size="small"
                  />
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button component={Link} to="/dna-repair/proteins" variant="contained" color="primary">
          Back to List
        </Button>
      </Box>
    </Box>
  );
};

export default ProteinDetail; 