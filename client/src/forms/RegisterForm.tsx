import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { theme } from "../styles/theme";
import type { RegisterFormProps } from "../types";

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string()
        .min(3, "User ID must be at least 3 characters")
        .required("User ID is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axiosInstance.post("/auth/register", {
          userId: values.userId,
          password: values.password,
        });
        onSuccess();
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            onError("User ID already exists. Please choose a different one.");
          } else {
            onError("Registration failed. Please try again.");
          }
        } else {
          onError("Unexpected error occurred.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isMandatoryFieldsFilled =
    formik.values.userId &&
    formik.values.password &&
    formik.values.confirmPassword;
  const isFormValid = formik.isValid && isMandatoryFieldsFilled;

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2.5}>
          <Box sx={{ width: "100%" }}>
            <Box sx={theme.mobileFormField}>
              <Typography sx={{ ...theme.mobileFormLabel, color: "#333333" }}>
                User ID*
              </Typography>
              <TextField
                name="userId"
                fullWidth
                variant="outlined"
                value={formik.values.userId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.userId && Boolean(formik.errors.userId)}
                helperText={formik.touched.userId && formik.errors.userId}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 1,
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333333",
                    padding: { xs: "10px 12px", sm: "12px 14px" },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={theme.mobileFormField}>
              <Typography sx={{ ...theme.mobileFormLabel, color: "#333333" }}>
                Password*
              </Typography>
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        edge="end"
                        sx={{ color: "#333333" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 1,
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333333",
                    padding: { xs: "10px 12px", sm: "12px 14px" },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={theme.mobileFormField}>
              <Typography sx={{ ...theme.mobileFormLabel, color: "#333333" }}>
                Confirm Password*
              </Typography>
              <TextField
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleShowConfirmPassword}
                        edge="end"
                        sx={{ color: "#333333" }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 1,
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333333",
                    padding: { xs: "10px 12px", sm: "12px 14px" },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Box sx={theme.mobileFormField}>
              <Box
                sx={{
                  minWidth: { xs: "0", sm: "120px" },
                  display: { xs: "none", sm: "block" },
                }}
              ></Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  width: "100%",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isFormValid || formik.isSubmitting}
                  sx={{
                    backgroundColor: "#000",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    padding: { xs: "12px 16px", sm: "14px 20px" },
                    fontSize: { xs: "14px", sm: "16px" },
                    borderRadius: 1,
                    flex: 1,
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                    "&:disabled": {
                      backgroundColor: "#666",
                      color: "#ccc",
                    },
                  }}
                >
                  Register
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    formik.resetForm();
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  sx={{
                    borderColor: "#333",
                    color: "#333333",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    padding: { xs: "12px 16px", sm: "14px 20px" },
                    fontSize: { xs: "14px", sm: "16px" },
                    borderRadius: 1,
                    flex: 1,
                    "&:hover": {
                      borderColor: "#333",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  CANCEL
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default RegisterForm;
