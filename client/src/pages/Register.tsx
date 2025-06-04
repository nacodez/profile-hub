import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Link } from "@mui/material";
import RegisterForm from "../forms/RegisterForm";
import Header from "../components/Header";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleSuccess = () => {
    navigate("/login");
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
                color: "#333333",
                fontWeight: "400",
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 2,
              }}
            >
              Create Your <span style={{ fontWeight: "bold" }}>Account</span>
            </Typography>

            <Box
              sx={{
                width: "60px",
                height: "3px",
                backgroundColor: "#333333",
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
              <RegisterForm onSuccess={handleSuccess} onError={handleError} />
            </Box>
          </Box>

          {error && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#333333",
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

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: "#333333", fontSize: "14px" }}
            >
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="always"
                sx={{
                  color: "#333333",
                  fontWeight: "bold",
                  textDecorationColor: "#333333",
                }}
              >
                Login here.
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default RegisterPage;
