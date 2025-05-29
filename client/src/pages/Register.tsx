import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Paper, Link } from "@mui/material";
import RegisterForm from "../forms/RegisterForm";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleSuccess = () => {
    navigate("/");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
          }}
        >
          {/* Custom Logo */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Box
              sx={{
                padding: 1.5,
                backgroundColor: "#4A90E2",
                borderRadius: 2,
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                minWidth: "80px",
                textAlign: "center",
                display: "inline-block",
              }}
            >
              ProfileHub
            </Box>
          </Box>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 3,
              color: "#333",
            }}
          >
            Create Account
          </Typography>

          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: 1,
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          <RegisterForm onSuccess={handleSuccess} onError={handleError} />

          <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/"
              underline="hover"
              sx={{ fontWeight: "bold", color: "#4A90E2" }}
            >
              Login here.
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
