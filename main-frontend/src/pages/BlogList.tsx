import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { BlogPostMeta } from '../types';
import { blogService } from '../services/blogService';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await blogService.getAllPosts();
        const validPosts = allPosts.filter(post => !!post.id);
        setPosts(validPosts);
        setFilteredPosts(validPosts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 3 }, pt: 0 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" color="primary" gutterBottom>
          Blog Catalog
        </Typography>
        <Typography color="text.secondary">
          Explore the latest research, news, and insights on DNA repair pathways.
        </Typography>
      </Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Search by title or author"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
        />
        <Select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="DNA-Repair">DNA-Repair</MenuItem>
          <MenuItem value="Research">Research</MenuItem>
          <MenuItem value="General">General</MenuItem>
        </Select>
        <Button component={Link} to="/dna-repair/blog/new" variant="contained" color="primary">
          New Blog
        </Button>
      </Box>
      {filteredPosts.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No blog posts found.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={1} mb={1}>
                    <Chip label={post.category} color="primary" size="small" />
                    {post.tags && post.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                  <Typography variant="h6" component={Link} to={`/dna-repair/blog/${post.id}`} color="primary" sx={{ textDecoration: 'none' }} gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                    {post.excerpt}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Author:</strong> {post.author} &nbsp;|&nbsp; <strong>Date:</strong> {post.publishDate}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to={`/dna-repair/blog/${post.id}`} size="small">
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BlogList; 