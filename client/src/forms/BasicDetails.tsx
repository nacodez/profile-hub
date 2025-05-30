import React, { useCallback, useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  MenuItem,
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../components/CustomTextField";
import CustomSelect from "../components/CustomSelect";

interface BasicDetailsFormValues {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string; // Changed from profileImage to profileImageUrl
}

interface Props {
  data?: Partial<BasicDetailsFormValues>;
  onUpdate: (values: BasicDetailsFormValues) => void;
}

const BasicDetails: React.FC<Props> = ({ data, onUpdate }) => {
  const lastUpdateRef = useRef<string>("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      salutation: data?.salutation || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      profileImageUrl: data?.profileImageUrl || "", // Changed field name
    },
    validationSchema: Yup.object({
      salutation: Yup.string().required("Please select your salutation."),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email address is required"),
    }),
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  // Set initial image from data when component mounts or data changes
  useEffect(() => {
    if (data?.profileImageUrl) {
      setProfileImageUrl(data.profileImageUrl);
    }
  }, [data?.profileImageUrl]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profilehub_preset");
    formData.append("folder", "profilehub/avatars");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dline6ta1/image/upload", // Your cloud name
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Debounced update function
  const debouncedUpdate = useCallback(
    (values: BasicDetailsFormValues) => {
      const currentValues = JSON.stringify(values);
      if (currentValues !== lastUpdateRef.current) {
        lastUpdateRef.current = currentValues;
        onUpdate(values);
      }
    },
    [onUpdate]
  );

  // Handle field changes with debouncing
  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formik.handleChange(event);

    setTimeout(() => {
      if (formik.isValid) {
        debouncedUpdate({
          ...formik.values,
          [event.target.name]: event.target.value,
          profileImageUrl: profileImageUrl || "",
        });
      }
    }, 300);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    formik.handleChange(event);

    setTimeout(() => {
      if (formik.isValid) {
        debouncedUpdate({
          ...formik.values,
          [event.target.name]: event.target.value,
          profileImageUrl: profileImageUrl || "",
        });
      }
    }, 300);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("Please select an image smaller than 5MB");
          return;
        }

        setUploading(true);

        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(file);

        setProfileImageUrl(imageUrl);

        // Update form values with the image URL
        const updatedValues = {
          ...formik.values,
          profileImageUrl: imageUrl,
        };

        // Update formik state
        formik.setFieldValue("profileImageUrl", imageUrl);

        // Trigger immediate update to parent
        debouncedUpdate(updatedValues);

        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUploadClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
        >
          Basic Details
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" gap={4} alignItems="flex-start">
          {/* Profile Image Upload - Left Side */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              minWidth: "120px",
              position: "relative",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: "#4A90E2",
              }}
              src={profileImageUrl || undefined}
            >
              {!profileImageUrl && <PhotoCamera />}
            </Avatar>

            {/* Upload Progress Indicator */}
            {uploading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "30px",
                  left: "50%",
                  marginLeft: "-12px",
                }}
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
              disabled={uploading}
            />
            <Button
              variant="text"
              onClick={handleUploadClick}
              disabled={uploading}
              sx={{
                color: "#333",
                textDecoration: "underline",
                textTransform: "none",
                padding: 0,
                minWidth: "auto",
              }}
            >
              {uploading ? "Uploading..." : "Upload image"}
            </Button>
          </Box>

          {/* Form Fields - Right Side */}
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            flex={1}
            sx={{ maxWidth: "sm" }}
          >
            {/* Salutation */}
            <CustomSelect
              label="Salutation*"
              name="salutation"
              fullWidth
              value={formik.values.salutation}
              onChange={handleSelectChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.salutation && Boolean(formik.errors.salutation)
              }
              helperText={formik.touched.salutation && formik.errors.salutation}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select salutation</em>
              </MenuItem>
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
            </CustomSelect>

            {/* First Name */}
            <CustomTextField
              label="First name*"
              name="firstName"
              fullWidth
              value={formik.values.firstName}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />

            {/* Last Name */}
            <CustomTextField
              label="Last name*"
              name="lastName"
              fullWidth
              value={formik.values.lastName}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />

            {/* Email */}
            <CustomTextField
              label="Email address*"
              name="email"
              type="email"
              fullWidth
              value={formik.values.email}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default BasicDetails;
