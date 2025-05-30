import React, { useCallback, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MenuItem, Box, Typography, Avatar, Button } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../components/CustomTextField"; // Import the custom component
import CustomSelect from "../components/CustomSelect"; // Import the custom select component

interface BasicDetailsFormValues {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Props {
  data?: Partial<BasicDetailsFormValues>;
  onUpdate: (values: BasicDetailsFormValues) => void;
}

const BasicDetails: React.FC<Props> = ({ data, onUpdate }) => {
  const lastUpdateRef = useRef<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      salutation: data?.salutation || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
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

    // Use setTimeout to debounce updates
    setTimeout(() => {
      if (formik.isValid) {
        debouncedUpdate({
          ...formik.values,
          [event.target.name]: event.target.value,
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
        });
      }
    }, 300);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: "#4A90E2",
              }}
              src={profileImage || undefined}
            >
              {!profileImage && <PhotoCamera />}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Button
              variant="text"
              onClick={handleUploadClick}
              sx={{
                color: "#333",
                textDecoration: "underline",
                textTransform: "none",
                padding: 0,
                minWidth: "auto",
              }}
            >
              Upload image
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
