import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import LoginForm from "../forms/LoginForm";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>("");

  const handleSuccess = () => {
    login();
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
      {/* Header */}
      <Header variant="login" />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 8,
        }}
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#000000",
                fontWeight: "400",
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 2,
              }}
            >
              Welcome to <span style={{ fontWeight: "bold" }}>ProfileHub</span>
            </Typography>
            <Box
              sx={{
                width: "60px",
                height: "3px",
                backgroundColor: "#000000",
                margin: "0 auto",
              }}
            />
          </Box>
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
