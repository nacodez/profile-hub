import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import LoginForm from "../forms/LoginForm";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>("");

  const handleSuccess = () => {
    login();
    navigate("/");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)
          `,
          zIndex: 1,
        },
      }}
    >
      {/* Logo in top left corner */}
      <Box sx={{ position: "relative", zIndex: 2, mb: 4 }}>
        <Box
          sx={{
            width: "fit-content",
            padding: "8px 16px",
            border: "2px solid rgba(255, 255, 255, 0.6)",
            borderRadius: 1,
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: "transparent",
          }}
        >
          ProfileHub
        </Box>
      </Box>

      {/* Center content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
          {/* Welcome Text */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: "400",
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 2,
              }}
            >
              Welcome to <span style={{ fontWeight: "bold" }}>ProfileHub</span>
            </Typography>

            {/* Underline */}
            <Box
              sx={{
                width: "60px",
                height: "3px",
                backgroundColor: "white",
                margin: "0 auto",
              }}
            />
          </Box>

          {/* Centered Login Form Container */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "400px" }}>
              <LoginForm onSuccess={handleSuccess} onError={handleError} />
            </Box>
          </Box>

          {/* Error Message */}
          {error && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: 1,
                  fontSize: "14px",
                  display: "inline-block",
                }}
              >
                {error}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
