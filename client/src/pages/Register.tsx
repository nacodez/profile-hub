import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Paper, Link } from "@mui/material";
import RegisterForm from "../forms/RegisterForm";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>

          <RegisterForm onSuccess={handleSuccess} />

          <Typography variant="body2" mt={2}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/" underline="hover">
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
