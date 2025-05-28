import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import { Edit, PhotoCamera, Menu, ArrowBack } from "@mui/icons-material";
import BasicDetails from "../forms/BasicDetails";
import AdditionalDetails from "../forms/AdditionalDetails";
import SpouseDetails from "../forms/SpouseDetails";
import Preferences from "../forms/Preferences";
import axios from "../api/axiosInstance";

// Define interfaces for type safety
interface BasicDetailsType {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AdditionalDetailsType {
  address?: string;
  country?: string;
  postalCode?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
}

interface SpouseDetailsType {
  salutation?: string;
  firstName?: string;
  lastName?: string;
}

interface PreferencesType {
  hobbies?: string;
  sports?: string;
  music?: string;
  movies?: string;
}

interface ProfileFormData {
  basicDetails?: BasicDetailsType;
  additionalDetails?: AdditionalDetailsType;
  spouseDetails?: SpouseDetailsType;
  preferences?: PreferencesType;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Basic Details");
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Load profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile");
        setFormData(response.data || {});
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (err.response?.status === 401) {
          // redirect to login if unauthorized
          navigate("/");
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const updateField = <K extends keyof ProfileFormData>(
    section: K,
    data: ProfileFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        ...data,
      },
    }));
  };

  const handleSaveAll = async () => {
    try {
      await axios.post("/profile", formData);
      setSaveStatus("success");
      setIsEditing(false);
      // clear success message after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Refetch data to reset any unsaved changes
    axios.get("/profile").then((res) => {
      setFormData(res.data || {});
    });
  };

  // determine which sections to show
  const sections = [
    "Basic Details",
    "Additional Details",
    ...(formData?.additionalDetails?.maritalStatus === "Married"
      ? ["Spouse Details"]
      : []),
    "Personal Preferences",
  ];

  const renderSectionContent = () => {
    if (!isEditing) {
      return renderViewMode();
    }

    // Show appropriate form based on active section
    switch (activeSection) {
      case "Basic Details":
        return (
          <BasicDetails
            data={formData?.basicDetails}
            onUpdate={(data) => updateField("basicDetails", data)}
          />
        );
      case "Additional Details":
        return (
          <AdditionalDetails
            data={formData?.additionalDetails}
            onUpdate={(data) => updateField("additionalDetails", data)}
          />
        );
      case "Spouse Details":
        return (
          <SpouseDetails
            data={formData?.spouseDetails}
            onUpdate={(data) => updateField("spouseDetails", data)}
          />
        );
      case "Personal Preferences":
        return (
          <Preferences
            data={formData?.preferences}
            onUpdate={(data) => updateField("preferences", data)}
          />
        );
      default:
        return null;
    }
  };

  const renderViewMode = () => {
    const basic = formData?.basicDetails;
    const additional = formData?.additionalDetails;
    const spouse = formData?.spouseDetails;
    const preferences = formData?.preferences;

    return (
      <Box>
        {/* Profile header with avatar */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              backgroundColor: "#666",
            }}
          >
            <PhotoCamera />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {basic?.firstName
                ? `${basic.firstName} ${basic.lastName || ""}`
                : "User Name"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {basic?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Basic Details Display */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Basic Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Salutation*
              </Typography>
              <Typography variant="body1">
                {basic?.salutation || "Not specified"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                First name*
              </Typography>
              <Typography variant="body1">
                {basic?.firstName || "Not specified"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Last name*
              </Typography>
              <Typography variant="body1">
                {basic?.lastName || "Not specified"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email address*
              </Typography>
              <Typography variant="body1">
                {basic?.email || "Not specified"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Additional Details Display */}
        {additional && Object.keys(additional).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Additional Details
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              {additional.address && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{additional.address}</Typography>
                </Box>
              )}
              {additional.country && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Country
                  </Typography>
                  <Typography variant="body1">{additional.country}</Typography>
                </Box>
              )}
              {additional.postalCode && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Postal Code
                  </Typography>
                  <Typography variant="body1">
                    {additional.postalCode}
                  </Typography>
                </Box>
              )}
              {additional.dob && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">{additional.dob}</Typography>
                </Box>
              )}
              {additional.gender && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">{additional.gender}</Typography>
                </Box>
              )}
              {additional.maritalStatus && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Marital Status
                  </Typography>
                  <Typography variant="body1">
                    {additional.maritalStatus}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Spouse Details Display - only show if married */}
        {additional?.maritalStatus === "Married" && spouse && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Spouse Details
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                }}
              >
                {spouse.salutation && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Salutation
                    </Typography>
                    <Typography variant="body1">{spouse.salutation}</Typography>
                  </Box>
                )}
                {spouse.firstName && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      First Name
                    </Typography>
                    <Typography variant="body1">{spouse.firstName}</Typography>
                  </Box>
                )}
                {spouse.lastName && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Name
                    </Typography>
                    <Typography variant="body1">{spouse.lastName}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}

        {/* Preferences Display */}
        {preferences && Object.keys(preferences).length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Personal Preferences
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                {preferences.hobbies && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Hobbies
                    </Typography>
                    <Typography variant="body1">
                      {preferences.hobbies}
                    </Typography>
                  </Box>
                )}
                {preferences.sports && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Sports
                    </Typography>
                    <Typography variant="body1">
                      {preferences.sports}
                    </Typography>
                  </Box>
                )}
                {preferences.music && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Music
                    </Typography>
                    <Typography variant="body1">{preferences.music}</Typography>
                  </Box>
                )}
                {preferences.movies && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Movies
                    </Typography>
                    <Typography variant="body1">
                      {preferences.movies}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    );
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 3 }}
        >
          {/* Header section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
              borderBottom: "1px solid #eee",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  mr: 2,
                }}
              >
                LOGO
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {isEditing ? "Edit Profile" : "My Profile"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isEditing && (
                <Button
                  variant="text"
                  startIcon={<ArrowBack />}
                  onClick={handleCancel}
                  sx={{ color: "#666" }}
                >
                  Go back to My Profile
                </Button>
              )}
              {!isEditing && (
                <Button
                  variant="text"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{ color: "#666" }}
                >
                  Edit profile
                </Button>
              )}
              <IconButton>
                <Menu />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", minHeight: "600px" }}>
            {/* Navigation Sidebar */}
            <Box
              sx={{
                width: 200,
                borderRight: "1px solid #eee",
                p: 2,
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              }}
            >
              {sections.map((section) => (
                <Box
                  key={section}
                  onClick={() => setActiveSection(section)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    backgroundColor:
                      activeSection === section ? "#f0f0f0" : "transparent",
                    fontWeight: activeSection === section ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Typography variant="body2">{section}</Typography>
                </Box>
              ))}
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, p: 3 }}>{renderSectionContent()}</Box>
          </Box>

          {/* Action buttons at bottom */}
          {isEditing && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                p: 3,
                borderTop: "1px solid #eee",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  borderColor: "#666",
                  color: "#666",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveAll}
                sx={{
                  backgroundColor: "#666",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#555",
                  },
                }}
              >
                Save & Update
              </Button>
            </Box>
          )}

          {/* Status messages */}
          {saveStatus === "success" && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#d4edda",
                color: "#155724",
                textAlign: "center",
              }}
            >
              Profile saved successfully.
            </Box>
          )}
          {saveStatus === "error" && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f8d7da",
                color: "#721c24",
                textAlign: "center",
              }}
            >
              Failed to save profile.
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
