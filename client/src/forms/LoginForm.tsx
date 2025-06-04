import React, { useState } from "react";
import { useFormik } from "formik";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { theme } from "../styles/theme";
import type { LoginFormProps } from "../types";

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
      keepLoggedIn: false,
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("User ID is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axiosInstance.post("/auth/login", values);
        onSuccess();
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            onError("Your user ID or password does not match.");
          } else {
            onError("Login error occurred. Please try again.");
          }
        } else {
          onError("Unexpected error occurred.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isMandatoryFieldsFilled =
    formik.values.userId && formik.values.password;
  const isFormValid = formik.isValid && isMandatoryFieldsFilled;

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2.5}>
          <Box sx={{ width: "100%" }}>
            <Box sx={theme.mobileFormField}>
              <Typography
                sx={{
                  ...theme.mobileFormLabel,
                  color: "#000000",
                  minWidth: { xs: "auto", sm: "80px" },
                }}
              >
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
                    color: "#000000",
                    padding: { xs: "10px 12px", sm: "12px 14px" },
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={theme.mobileFormField}>
              <Typography
                sx={{
                  ...theme.mobileFormLabel,
                  color: "#000000",
                  minWidth: { xs: "auto", sm: "80px" },
                }}
              >
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: "#000000" }}
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
                    color: "#000000",
                    padding: { xs: "10px 12px", sm: "12px 14px" },
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%", mt: 1 }}>
            <Box sx={theme.mobileFormField}>
              <Box
                sx={{
                  minWidth: { xs: "0", sm: "80px" },
                  display: { xs: "none", sm: "block" },
                }}
              ></Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="keepLoggedIn"
                    checked={formik.values.keepLoggedIn}
                    onChange={formik.handleChange}
                    size="small"
                    sx={{
                      color: "#000000",
                      "&.Mui-checked": {
                        color: "#000000",
                      },
                    }}
                  />
                }
                label={
                  <span
                    style={{
                      color: "#000000",
                      fontSize: window.innerWidth < 768 ? "13px" : "14px",
                    }}
                  >
                    Keep me logged in
                  </span>
                }
                sx={{
                  width: "100%",
                  justifyContent: { xs: "flex-start", sm: "flex-start" },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={theme.mobileFormField}>
              <Box
                sx={{
                  minWidth: { xs: "0", sm: "80px" },
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
                    padding: { xs: "10px 14px", sm: "12px 16px" },
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
                  {formik.isSubmitting ? "LOGGING IN..." : "LOGIN"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    formik.resetForm();
                    setShowPassword(false);
                  }}
                  sx={{
                    borderColor: "#000",
                    color: "#000",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    padding: { xs: "10px 14px", sm: "12px 16px" },
                    fontSize: { xs: "14px", sm: "16px" },
                    borderRadius: 1,
                    flex: 1,
                    "&:hover": {
                      borderColor: "#333",
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  CANCEL
                </Button>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#000000",
                  fontSize: { xs: "13px", sm: "14px" },
                  textAlign: "center",
                  px: { xs: 1, sm: 0 },
                }}
              >
                No account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="always"
                  sx={{
                    color: "#000000",
                    fontWeight: "bold",
                    textDecorationColor: "#000000",
                  }}
                >
                  Register here.
                </Link>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "100%", mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: "#666",
                  fontSize: { xs: "12px", sm: "13px" },
                  textDecoration: "underline",
                }}
              >
                Forgot your password?
              </Link>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default LoginForm;
