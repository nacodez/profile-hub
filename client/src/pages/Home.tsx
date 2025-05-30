import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { Person, Security, Dashboard, Settings } from "@mui/icons-material";
import Header from "../components/Header";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header Component */}
      <Header variant="home" />

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ py: 8, mt: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "#333333",
              mb: 3,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
            }}
          >
            Welcome to Profile Hub
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#333333",
              mb: 4,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Your centralized platform for managing personal information,
            preferences, and profile settings with security and simplicity in
            mind.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/profile")} // This stays the same (view mode)
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#4A90E2",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#333333",
                  color: "white",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              View My Profile
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() =>
                navigate("/profile", { state: { editMode: true } })
              } // Add edit mode state
              sx={{
                color: "#333333",
                borderColor: "#333333",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  borderColor: "#333333",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                border: "1px solid #333333",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                },
              }}
            >
              <Person sx={{ fontSize: 50, color: "#333333", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#333333", fontWeight: "bold", mb: 2 }}
              >
                Personal Info
              </Typography>
              <Typography sx={{ color: "#333333" }}>
                Manage your basic details, contact information, and personal
                preferences securely.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                border: "1px solid #333333",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                },
              }}
            >
              <Security sx={{ fontSize: 50, color: "#333333", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#333333", fontWeight: "bold", mb: 2 }}
              >
                Secure & Private
              </Typography>
              <Typography sx={{ color: "#333333" }}>
                Your data is protected with enterprise-grade efficient security
                and privacy controls.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                border: "1px solid #333333",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                },
              }}
            >
              <Dashboard sx={{ fontSize: 50, color: "#333333", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#333333", fontWeight: "bold", mb: 2 }}
              >
                Easy Management
              </Typography>
              <Typography sx={{ color: "#333333" }}>
                Intuitive interface makes managing your profile information
                simple and efficient.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                border: "1px solid #333333",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                },
              }}
            >
              <Settings sx={{ fontSize: 50, color: "#333333", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "#333333", fontWeight: "bold", mb: 2 }}
              >
                Customizable
              </Typography>
              <Typography sx={{ color: "#333333" }}>
                Tailor your profile sections and preferences to match your
                specific needs.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-5%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default HomePage;
