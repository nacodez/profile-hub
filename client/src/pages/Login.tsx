import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import LoginForm from '../forms/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/profile');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <LoginForm onSuccess={handleSuccess} />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
