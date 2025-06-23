import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DNA Repair Pathways
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/dna-repair"
          >
            HR Pathway
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/dna-repair/nhej"
          >
            NHEJ Pathway
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/dna-repair/proteins"
          >
            Proteins
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/dna-repair/proteins/new"
          >
            Add Protein
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 