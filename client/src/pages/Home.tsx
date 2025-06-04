import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { Person, Security, Dashboard, Settings } from "@mui/icons-material";
import Header from "../components/Header";
import axios from "../api/axiosInstance";
import type { HomepageContent } from "../types";

const iconMap: Record<string, typeof Person> = {
  Person,
  Security,
  Dashboard,
  Settings,
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [homepageContent, setHomepageContent] =
    useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("/homepage-content");
        if (response.data.success) {
          setHomepageContent(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch homepage content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!homepageContent) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Error loading homepage content</Typography>
      </Box>
    );
  }

  const { heroSection, featureCards } = homepageContent;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Header variant="home" />

      <Container maxWidth="xl" sx={{ py: 8, mt: 8 }}>
        {/* Hero Section */}
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
            {heroSection.title}
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
            {heroSection.description}
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
              onClick={() => navigate("/profile")}
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
              VIEW MY PROFILE
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() =>
                navigate("/profile", { state: { editMode: true } })
              }
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
              EDIT PROFILE
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mt: 6 }}>
          {featureCards
            ?.sort((a, b) => a.order - b.order)
            ?.map((feature, index) => {
              const IconComponent = iconMap[feature.iconName] || Person;

              return (
                <Grid item xs={12} md={3} key={index}>
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
                    <IconComponent
                      sx={{ fontSize: 50, color: "#333333", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: "#333333", fontWeight: "bold", mb: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "#333333" }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
        </Grid>
      </Container>
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
