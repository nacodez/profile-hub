import React, { useCallback, useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MenuItem, Box, Typography, Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../components/CustomTextField";
import CustomSelect from "../components/CustomSelect";
import type {
  BasicDetails as BasicDetailsType,
  BasicDetailsProps,
} from "../types";

const BasicDetails: React.FC<BasicDetailsProps> = ({ data, onUpdate }) => {
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
      profileImageUrl: data?.profileImageUrl || "",
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

  useEffect(() => {
    if (data?.profileImageUrl) {
      setProfileImageUrl(data.profileImageUrl);
    }
  }, [data?.profileImageUrl]);

  const debouncedUpdate = useCallback(
    (values: BasicDetailsType) => {
      const currentValues = JSON.stringify(values);
      if (currentValues !== lastUpdateRef.current) {
        lastUpdateRef.current = currentValues;
        onUpdate(values);
      }
    },
    [onUpdate]
  );

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

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
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
    if (
      !file ||
      !file.type.startsWith("image/") ||
      file.size > 5 * 1024 * 1024
    ) {
      if (file && file.size > 5 * 1024 * 1024)
        alert("File too large (max 5MB)");
      if (file && !file.type.startsWith("image/"))
        alert("Please select an image");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "profilehub_preset");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dllne6ta1/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setProfileImageUrl(data.secure_url);
        formik.setFieldValue("profileImageUrl", data.secure_url);
        debouncedUpdate({ ...formik.values, profileImageUrl: data.secure_url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" justifyContent={"center"} mr={{ xs: 0, lg: 15 }}>
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
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
              src={profileImageUrl || undefined}
            >
              {!profileImageUrl && <PhotoCamera />}
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#333",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            flex={1}
            sx={{ maxWidth: "sm" }}
          >
            <Box
              sx={{
                display: { xs: "flex", sm: "flex", md: "flex", lg: "none" },
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                width: "100%",
              }}
            >
              <Typography
                component="label"
                sx={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#666",
                  marginBottom: "4px",
                }}
              >
                Profile Photo
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#4A90E2",
                  }}
                  src={profileImageUrl || undefined}
                >
                  {!profileImageUrl && <PhotoCamera />}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Typography>
              </Box>
            </Box>
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
              helperText={
                formik.touched.salutation ? formik.errors.salutation : undefined
              }
              displayEmpty
            >
              <MenuItem value="">
                <em>Select salutation</em>
              </MenuItem>
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
            </CustomSelect>

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
