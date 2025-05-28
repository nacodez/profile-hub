import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Paper, Link } from "@mui/material";
import LoginForm from "../forms/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleSuccess = () => {
    navigate("/profile");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
          {/* Logo placeholder */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 40,
                border: "2px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#666",
                borderRadius: 1,
              }}
            >
              LOGO
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
            Welcome to <span style={{ fontWeight: "bold" }}>myApp</span>
          </Typography>

          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#666",
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

          <LoginForm onSuccess={handleSuccess} onError={handleError} />

          <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
            No account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Register here.
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
