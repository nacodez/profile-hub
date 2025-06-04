import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Edit, PhotoCamera, ArrowBack } from "@mui/icons-material";
import BasicDetails from "../forms/BasicDetails";
import AdditionalDetails from "../forms/AdditionalDetails";
import SpouseDetails from "../forms/SpouseDetails";
import Preferences from "../forms/Preferences";
import axios from "../api/axiosInstance";
import { default as axiosLib } from "axios";
import Header from "../components/Header";
import { theme } from "../styles/theme";
import type { ProfileFormData } from "../types";

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

  const [hasChanges, setHasChanges] = useState(false);
  const [originalFormData, setOriginalFormData] =
    useState<ProfileFormData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile");
        const profileData = response.data || {};

        if (profileData.additionalDetails?.dob) {
          const date = new Date(profileData.additionalDetails.dob);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          profileData.additionalDetails.dobDisplay = `${day}-${month}-${year}`;
        }

        setFormData(profileData);
        setOriginalFormData(JSON.parse(JSON.stringify(profileData)));
        setLoading(false); // Add this line
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (axiosLib.isAxiosError(err) && err.response?.status === 401) {
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
    const newFormData = {
      ...formData,
      [section]: {
        ...formData?.[section],
        ...data,
      },
    };

    setFormData(newFormData);

    const hasFormChanges =
      JSON.stringify(newFormData) !== JSON.stringify(originalFormData);
    setHasChanges(hasFormChanges);
  };

  const handleSaveAll = async () => {
    try {
      if (
        !formData?.basicDetails?.salutation ||
        !formData?.basicDetails?.firstName ||
        !formData?.basicDetails?.lastName ||
        !formData?.basicDetails?.email
      ) {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
        return;
      }

      await axios.post("/profile", formData);
      setSaveStatus("success");
      setIsEditing(false);
      setHasChanges(false);
      setOriginalFormData(JSON.parse(JSON.stringify(formData)));
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasChanges(false);
    window.history.replaceState({}, document.title);
    if (originalFormData) {
      setFormData(JSON.parse(JSON.stringify(originalFormData)));
    }
  };

  const handleProfileEdit = (mode?: "view" | "edit") => {
    if (mode === "view") {
      setIsEditing(false);
    } else if (mode === "edit") {
      setIsEditing(true);
    } else {
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

  const renderViewModeBySection = () => {
    const basic = formData?.basicDetails;
    const additional = formData?.additionalDetails;
    const spouse = formData?.spouseDetails;
    const preferences = formData?.preferences;

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
          { key: "dobDisplay", label: "Date of Birth*" },
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {config.hasImage && (
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mb: 3,
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
              {!basic?.profileImageUrl && <PhotoCamera />}
            </Avatar>
          </Box>
        )}
        <Box
          display="flex"
          gap={4}
          alignItems="flex-start"
          sx={{
            justifyContent: { xs: "center", md: "flex-start" },
            width: "100%",
            maxWidth: { xs: "400px", md: "100%" },
          }}
        >
          {config.hasImage && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
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
                {!basic?.profileImageUrl && <PhotoCamera />}
              </Avatar>
            </Box>
          )}
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            flex={1}
            sx={{
              maxWidth: "sm",
              width: "100%",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {hasData ? (
              <>
                {config.fields.map((field) => {
                  const value = (config.data as Record<string, unknown>)?.[
                    field.key
                  ];
                  if (!value) return null;

                  return (
                    <Box key={field.key} sx={{ width: "100%" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333",
                          fontWeight: "800",
                          mb: 0.5,
                          textAlign: { xs: "center", md: "left" },
                        }}
                      >
                        {field.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#333",
                          textAlign: { xs: "center", md: "left" },
                        }}
                      >
                        {String(value)}
                      </Typography>
                    </Box>
                  );
                })}
              </>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {config.emptyMessage}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  };
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

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
      <Header variant="profile" onProfileEdit={handleProfileEdit} />
      <Container
        maxWidth={false}
        sx={{
          ...theme.responsiveContainer,
          mt: { xs: 6, sm: 8, md: 10 },
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 2, md: 3 },
            width: "100%",
            minHeight: { xs: "auto", md: "600px" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              order: { xs: 1, lg: 1 },
              display: { xs: "block", lg: "none" },
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 1,
                pb: 2,
                "&::-webkit-scrollbar": { height: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: "2px",
                },
              }}
            >
              {sections.map((section) => (
                <Box
                  key={section}
                  onClick={() => setActiveSection(section)}
                  sx={{
                    py: 1,
                    px: 2,
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor:
                      activeSection === section
                        ? "rgba(51, 51, 51, 0.9)"
                        : "rgba(255,255,255,0.1)",
                    color: activeSection === section ? "white" : "#333",
                    whiteSpace: "nowrap",
                    minWidth: "fit-content",
                    width: "auto",
                    textAlign: "center",
                    fontSize: "0.75rem",
                    fontWeight: activeSection === section ? "bold" : "normal",
                    border: "1px solid #ddd",
                    flexShrink: 0,
                    "&:hover": {
                      backgroundColor:
                        activeSection === section
                          ? "rgba(51, 51, 51, 0.9)"
                          : "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  {section}
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              width: { lg: 250 },
              flexShrink: 0,
              display: { xs: "none", lg: "block" },
              order: { lg: 1 },
              mt: { lg: 8 },
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
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              order: { xs: 2, lg: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: { xs: 2, sm: 3, md: 4 },
                gap: { xs: 2, sm: 1 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
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
                    ml: { xs: 2, sm: 3 },
                    mr: { xs: 1, sm: 3 },
                    minWidth: "20px",
                    display: { xs: "none", sm: "block" },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
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
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                      Go back to My Profile
                    </Box>
                    <Box
                      component="span"
                      sx={{ display: { xs: "inline", sm: "none" } }}
                    >
                      Back
                    </Box>
                  </Button>
                )}
                {!isEditing && (
                  <Button
                    variant="text"
                    endIcon={<Edit />}
                    onClick={() => {
                      setIsEditing(true);
                      window.history.replaceState({}, document.title);
                    }}
                    sx={{
                      color: "#333",
                      textDecoration: "underline",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    Edit profile
                  </Button>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                px: { xs: 0, sm: 2, md: 4 },
              }}
            >
              {renderSectionContent()}

              {isEditing && (
                <>
                  <Box display="flex" justifyContent={"center"}>
                    <Box
                      sx={{
                        mt: 4,
                        width: "100%",
                        maxWidth: "sm",
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleSaveAll}
                        fullWidth
                        disabled={!hasChanges}
                        sx={{
                          backgroundColor: "#666",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          py: 1.5,
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          "&:hover": { backgroundColor: "#555" },
                          "&:disabled": {
                            backgroundColor: "#ccc",
                            color: "#999",
                          },
                        }}
                      >
                        Save & Update
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        fullWidth
                        disabled={!hasChanges}
                        sx={{
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          borderColor: "#666",
                          color: "#666",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          py: 1.5,
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          "&:disabled": {
                            borderColor: "#ccc",
                            color: "#999",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent={"center"}>
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: "sm",
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontSize: { xs: "11px", sm: "12px" },
                          textAlign: { xs: "center", sm: "left", md: "left" },
                        }}
                      >
                        * Mandatory field
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
              {saveStatus !== "idle" && (
                <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        saveStatus === "success"
                          ? "success.main"
                          : "error.main",
                      fontWeight: "medium",
                    }}
                  >
                    {saveStatus === "success"
                      ? "Profile saved successfully!"
                      : "Error saving profile. Please check required fields."}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
