import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import BasicDetails from "../forms/BasicDetails";
import AdditionalDetails from "../forms/AdditionalDetails";
import SpouseDetails from "../forms/SpouseDetails";
import Preferences from "../forms/Preferences";
import axios from "../api/axiosInstance";

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
  favoriteSports?: string;
  musicGenres?: string;
  tvShows?: string;
}

interface ProfileFormData {
  basicDetails?: BasicDetailsType;
  additionalDetails?: AdditionalDetailsType;
  spouseDetails?: SpouseDetailsType;
  preferences?: PreferencesType;
}

const Profile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get("/profile")
      .then((res) => {
        setFormData(res.data || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

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
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const showSpouseTab =
    formData?.additionalDetails?.maritalStatus === "Married";

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Paper elevation={2} sx={{ padding: 3 }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Basic Details" />
            <Tab label="Additional Details" />
            {showSpouseTab && <Tab label="Spouse Details" />}
            <Tab label="Preferences" />
          </Tabs>

          <Box mt={3}>
            {tab === 0 && (
              <BasicDetails
                data={formData?.basicDetails}
                onUpdate={(data) => updateField("basicDetails", data)}
              />
            )}
            {tab === 1 && (
              <AdditionalDetails
                data={formData?.additionalDetails}
                onUpdate={(data) => updateField("additionalDetails", data)}
              />
            )}
            {tab === 2 && showSpouseTab && (
              <SpouseDetails
                data={formData?.spouseDetails}
                onUpdate={(data) => updateField("spouseDetails", data)}
              />
            )}
            {(tab === 2 && !showSpouseTab) || (tab === 3 && showSpouseTab) ? (
              <Preferences
                data={formData?.preferences}
                onUpdate={(data) => updateField("preferences", data)}
              />
            ) : null}
          </Box>

          <Box mt={4} textAlign="right">
            <Button variant="contained" color="primary" onClick={handleSaveAll}>
              Save All
            </Button>
            {saveStatus === "success" && (
              <Typography variant="body2" color="green" mt={1}>
                Profile saved successfully.
              </Typography>
            )}
            {saveStatus === "error" && (
              <Typography variant="body2" color="red" mt={1}>
                Failed to save profile.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
