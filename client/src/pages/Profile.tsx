import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Box, Typography, Button, Avatar } from "@mui/material";
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
  profileImageUrl?: string; // Optional profile image field
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
  const location = useLocation();
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

  useEffect(() => {
    const state = location.state as { editMode?: boolean };
    if (state?.editMode) {
      setIsEditing(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
    // Clear any navigation state
    window.history.replaceState({}, document.title);
    axios.get("/profile").then((res) => {
      setFormData(res.data || {});
    });
  };

  const handleProfileEdit = (mode?: "view" | "edit") => {
    if (mode === "view") {
      setIsEditing(false);
    } else if (mode === "edit") {
      setIsEditing(true);
    } else {
      // Default behavior (for the Edit profile button on the page)
      setIsEditing(!isEditing);
    }
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

  // Replace the renderViewModeBySection function with this updated version:

  const renderViewModeBySection = () => {
    const basic = formData?.basicDetails;
    const additional = formData?.additionalDetails;
    const spouse = formData?.spouseDetails;
    const preferences = formData?.preferences;

    // Define field configurations for each section
    const sectionConfigs = {
      "Basic Details": {
        title: "Basic Details",
        description: undefined,
        hasImage: true,
        data: basic,
        fields: [
          { key: "salutation", label: "Salutation*" },
          { key: "firstName", label: "First name*" },
          { key: "lastName", label: "Last name*" },
          { key: "email", label: "Email address*" },
        ],
        emptyMessage: "No basic details provided yet.",
      },
      "Additional Details": {
        title: "Additional Details",
        description: undefined,
        hasImage: false,
        data: additional,
        fields: [
          { key: "address", label: "Home Address" },
          { key: "country", label: "Country" },
          { key: "postalCode", label: "Postal Code*" },
          { key: "dob", label: "Date of Birth*" },
          { key: "gender", label: "Gender" },
          { key: "maritalStatus", label: "Marital Status" },
        ],
        emptyMessage: "No additional details provided yet.",
      },
      "Spouse Details": {
        title: "Spouse Details",
        description: "Please provide your spouse's information",
        hasImage: false,
        data: spouse,
        fields: [
          { key: "salutation", label: "Salutation" },
          { key: "firstName", label: "First Name" },
          { key: "lastName", label: "Last Name" },
        ],
        emptyMessage: "No spouse details provided yet.",
      },
      "Personal Preferences": {
        title: "Personal Preferences",
        description: "Tell us about your interests and preferences",
        hasImage: false,
        data: preferences,
        fields: [
          { key: "hobbies", label: "Hobbies and Interests" },
          { key: "sports", label: "Favorite Sport(s)" },
          { key: "music", label: "Preferred Music Genre(s)" },
          { key: "movies", label: "Preferred Movie/TV Show(s)" },
        ],
        emptyMessage: "No preferences provided yet.",
      },
    };

    const config = sectionConfigs[activeSection as keyof typeof sectionConfigs];
    if (!config) return null;

    const hasData =
      config.data &&
      Object.keys(config.data).some(
        (key) => (config.data as Record<string, unknown>)[key]
      );

    return (
      <Box>
        {/* Section Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
          >
            {config.title}
          </Typography>
          {config.description && (
            <Typography variant="body2" sx={{ color: "#666" }}>
              {config.description}
            </Typography>
          )}
        </Box>

        {/* Content Layout */}
        <Box display="flex" gap={4} alignItems="flex-start">
          {/* Profile Image - Only for Basic Details */}
          {config.hasImage && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                minWidth: "120px",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#4A90E2",
                }}
                src={basic?.profileImageUrl || undefined}
              >
                {basic?.profileImageUrl && <PhotoCamera />}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  color: "#333",
                  textDecoration: "underline",
                  fontSize: "14px",
                }}
              >
                Profile Image
              </Typography>
            </Box>
          )}

          {/* Form Data */}
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            flex={1}
            sx={{ maxWidth: "sm" }}
          >
            {hasData ? (
              <>
                {config.fields.map((field) => {
                  const value = (config.data as Record<string, unknown>)?.[
                    field.key
                  ];
                  if (!value) return null;

                  return (
                    <Box key={field.key}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#333", fontWeight: "800", mb: 0.5 }}
                      >
                        {field.label}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#333" }}>
                        {String(value)}
                      </Typography>
                    </Box>
                  );
                })}
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "#666" }}>
                {config.emptyMessage}
              </Typography>
            )}
          </Box>
        </Box>
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
                  fontWeight: activeSection === section ? "bold" : "normal",
                  color: "#333",
                  borderBottom:
                    activeSection === section
                      ? "2px solid #333"
                      : "1px solid #ccc",
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
                    endIcon={<Edit />}
                    onClick={() => {
                      setIsEditing(true);
                      // Clear any navigation state
                      window.history.replaceState({}, document.title);
                    }}
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
                  <>
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

                    {/* Mandatory field note */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "12px",
                        mt: 4,
                        ml: activeSection === "Basic Details" && 19,
                      }}
                    >
                      * Mandatory field
                    </Typography>
                  </>
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
