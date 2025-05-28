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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Edit,
  PhotoCamera,
  Menu as MenuIcon,
  ArrowBack,
  Home,
  Person,
  EditNote,
  Logout,
} from "@mui/icons-material";
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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = (action: string) => {
    handleMenuClose();
    switch (action) {
      case "home":
        navigate("/");
        break;
      case "profile":
        setIsEditing(false);
        setActiveSection("Basic Details");
        break;
      case "edit":
        setIsEditing(true);
        setActiveSection("Basic Details");
        break;
      case "logout":
        axios.post("/auth/logout").finally(() => {
          navigate("/");
        });
        break;
    }
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

  // NEW: Render only the selected section in view mode
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
        );

      case "Additional Details":
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
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
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {additional.address}
                    </Typography>
                  </Box>
                )}
                {additional.country && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="body1">
                      {additional.country}
                    </Typography>
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
            ) : (
              <Typography variant="body2" color="text.secondary">
                No additional details provided yet.
              </Typography>
            )}
          </Box>
        );

      case "Spouse Details":
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
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
            ) : (
              <Typography variant="body2" color="text.secondary">
                No spouse details provided yet.
              </Typography>
            )}
          </Box>
        );

      case "Personal Preferences":
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Personal Preferences
            </Typography>
            {preferences &&
            Object.keys(preferences).some((key) => preferences[key]) ? (
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
            ) : (
              <Typography variant="body2" color="text.secondary">
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ maxWidth: { xs: "100%", sm: "lg", md: "xl" } }}
      >
        <Paper
          elevation={8}
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 3 }}
        >
          {/* Header */}
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
              {/* Custom Logo */}
              <Box
                sx={{
                  mr: 2,
                  padding: 1,
                  backgroundColor: "#4A90E2",
                  borderRadius: 2,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  minWidth: "60px",
                  textAlign: "center",
                }}
              >
                MyApp
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
              <IconButton onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleMenuItemClick("home")}>
                  <ListItemIcon>
                    <Home fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Home</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("home")}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>My Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("edit")}>
                  <ListItemIcon>
                    <EditNote fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("logout")}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box sx={{ display: "flex", minHeight: "600px" }}>
            {/* Sidebar */}
            <Box
              sx={{
                width: 250,
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
                      activeSection === section ? "#e3f2fd" : "transparent",
                    fontWeight: activeSection === section ? "bold" : "normal",
                    color: activeSection === section ? "#1976d2" : "inherit",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">{section}</Typography>
                </Box>
              ))}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, p: 4 }}>{renderSectionContent()}</Box>
          </Box>

          {/* Footer */}
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
                  backgroundColor: "#4A90E2",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#357abd" },
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
