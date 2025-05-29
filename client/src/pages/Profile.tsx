import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { Edit, PhotoCamera, ArrowBack } from "@mui/icons-material";
import BasicDetails from "../forms/BasicDetails";
import AdditionalDetails from "../forms/AdditionalDetails";
import SpouseDetails from "../forms/SpouseDetails";
import Preferences from "../forms/Preferences";
import axios from "../api/axiosInstance";
import Header from "../components/Header";

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
          navigate("/login");
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
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    axios.get("/profile").then((res) => {
      setFormData(res.data || {});
    });
  };

  const handleProfileEdit = () => {
    setIsEditing(!isEditing);
    setActiveSection("Basic Details");
  };

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
      return renderViewModeBySection();
    }

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

  const renderViewModeBySection = () => {
    const basic = formData?.basicDetails;
    const additional = formData?.additionalDetails;
    const spouse = formData?.spouseDetails;
    const preferences = formData?.preferences;

    switch (activeSection) {
      case "Basic Details":
        return (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mr: 3,
                  backgroundColor: "#4A90E2",
                }}
              >
                <PhotoCamera />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  {basic?.firstName
                    ? `${basic.firstName} ${basic.lastName || ""}`
                    : "User Name"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {basic?.email}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2, borderColor: "#ddd" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
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
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontWeight: "bold" }}
                >
                  Salutation*
                </Typography>
                <Typography variant="body1" sx={{ color: "#333" }}>
                  {basic?.salutation || "Not specified"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontWeight: "bold" }}
                >
                  First name*
                </Typography>
                <Typography variant="body1" sx={{ color: "#333" }}>
                  {basic?.firstName || "Not specified"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontWeight: "bold" }}
                >
                  Last name*
                </Typography>
                <Typography variant="body1" sx={{ color: "#333" }}>
                  {basic?.lastName || "Not specified"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontWeight: "bold" }}
                >
                  Email address*
                </Typography>
                <Typography variant="body1" sx={{ color: "#333" }}>
                  {basic?.email || "Not specified"}
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      case "Additional Details":
        return (
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
              Additional Details
            </Typography>
            {additional && Object.keys(additional).length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                }}
              >
                {additional.address && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {additional.address}
                    </Typography>
                  </Box>
                )}
                {additional.country && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Country
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {additional.country}
                    </Typography>
                  </Box>
                )}
                {additional.postalCode && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Postal Code
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {additional.postalCode}
                    </Typography>
                  </Box>
                )}
                {additional.dob && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {additional.dob}
                    </Typography>
                  </Box>
                )}
                {additional.gender && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Gender
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {additional.gender}
                    </Typography>
                  </Box>
                )}
                {additional.maritalStatus && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Marital Status
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {additional.maritalStatus}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "#666" }}>
                No additional details provided yet.
              </Typography>
            )}
          </Box>
        );

      case "Spouse Details":
        return (
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
              Spouse Details
            </Typography>
            {spouse && Object.keys(spouse).some((key) => spouse[key]) ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                }}
              >
                {spouse.salutation && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Salutation
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {spouse.salutation}
                    </Typography>
                  </Box>
                )}
                {spouse.firstName && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      First Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {spouse.firstName}
                    </Typography>
                  </Box>
                )}
                {spouse.lastName && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Last Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {spouse.lastName}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "#666" }}>
                No spouse details provided yet.
              </Typography>
            )}
          </Box>
        );

      case "Personal Preferences":
        return (
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
              Personal Preferences
            </Typography>
            {preferences &&
            Object.keys(preferences).some((key) => preferences[key]) ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                {preferences.hobbies && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Hobbies
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {preferences.hobbies}
                    </Typography>
                  </Box>
                )}
                {preferences.sports && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Sports
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {preferences.sports}
                    </Typography>
                  </Box>
                )}
                {preferences.music && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Music
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {preferences.music}
                    </Typography>
                  </Box>
                )}
                {preferences.movies && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "bold" }}
                    >
                      Movies
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {preferences.movies}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "#666" }}>
                No preferences provided yet.
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
      {/* Header Component */}
      <Header variant="profile" onProfileEdit={handleProfileEdit} />
      <Container
        maxWidth={false} // Remove maxWidth constraint
        sx={{
          width: "100%",
          mt: 10,
          position: "relative",
          zIndex: 2,
          paddingLeft: "16px !important", // Force override MUI's padding
          paddingRight: "16px !important", // Force override MUI's padding
          marginLeft: 0, // Remove auto centering
          marginRight: 0, // Remove auto centering
          maxWidth: "none", // Remove max-width constraint
        }}
      >
        <Box
          sx={{ display: "flex", minHeight: "600px", gap: 3, width: "100%" }}
        >
          {/* Left Sidebar - Navigation */}
          <Box
            sx={{
              width: 250,
              p: 0,
              flexShrink: 0, // Prevent shrinking
            }}
          >
            {sections.map((section) => (
              <Box
                key={section}
                onClick={() => setActiveSection(section)}
                sx={{
                  py: 2,
                  px: 0,
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                  fontWeight: activeSection === section ? "bold" : "normal",
                  color: "#333",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  mb: 1,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "inherit" }}>
                  {section}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Right Content Area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {" "}
            {/* Back to original flex container */}
            {/* Profile Header - Full Width */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {isEditing ? "Edit Profile" : "My Profile"}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: "3px",
                    backgroundColor: "#333",
                    ml: 3,
                    mr: 3,
                    minWidth: "20px", // Minimum line width
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                {isEditing && (
                  <Button
                    variant="text"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    sx={{
                      color: "#333",
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Go back to My Profile
                  </Button>
                )}
                {!isEditing && (
                  <Button
                    variant="text"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      color: "#333",
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Edit profile
                  </Button>
                )}
              </Box>
            </Box>
            {/* Content - Centered */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center", // Center the content
                px: 4,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "800px", // Limit form content width
                }}
              >
                {renderSectionContent()}
                {isEditing && (
                  <Box
                    sx={{
                      mt: 4, // Add top margin to separate from form content
                      width: "100%",
                      maxWidth: "sm", // Match the text field maxWidth
                      display: "flex",
                      ml: activeSection === "Basic Details" && 19,
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleSaveAll}
                      fullWidth
                      sx={{
                        backgroundColor: "#666",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        py: 1.5, // Add vertical padding to match text field height
                        "&:hover": { backgroundColor: "#555" },
                      }}
                    >
                      Save & Update
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      fullWidth
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        borderColor: "#666",
                        color: "#666",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        py: 1.5, // Add vertical padding to match text field height
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            {/* Footer - Centered with form content */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
