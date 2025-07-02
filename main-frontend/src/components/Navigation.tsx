import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'HR Pathway', to: '/dna-repair' },
  { label: 'NHEJ Pathway', to: '/dna-repair/nhej' },
  { label: 'Proteins', to: '/dna-repair/proteins' },
  { label: 'Add Protein', to: '/dna-repair/proteins/new' },
  { label: 'Blog', to: '/dna-repair/blog' },
  { label: 'Admin', to: '/dna-repair/admin' },
];

const Navigation: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.to}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
          DNA Repair Pathways
        </Typography>
        {isMobile ? (
          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        ) : (
        <Box>
            {navItems.map((item) => (
          <Button 
                key={item.to}
            color="inherit" 
            component={RouterLink} 
                to={item.to}
                sx={{ borderRadius: 2, mx: 0.5 }}
          >
                {item.label}
          </Button>
            ))}
        </Box>
        )}
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navigation; 