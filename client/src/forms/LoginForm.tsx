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

interface Props {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const LoginForm: React.FC<Props> = ({ onSuccess, onError }) => {
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

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2.5}>
          {/* User ID Field */}
          <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "500",
                  minWidth: "80px",
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
                    color: "white",
                    padding: "12px 14px",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Password Field */}
          <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "500",
                  minWidth: "80px",
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
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
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
                    color: "white",
                    padding: "12px 14px",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Keep me logged in checkbox */}
          <Box sx={{ width: "100%", mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ minWidth: "80px" }}></Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="keepLoggedIn"
                    checked={formik.values.keepLoggedIn}
                    onChange={formik.handleChange}
                    size="small"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label={
                  <span style={{ color: "white", fontSize: "14px" }}>
                    Keep me logged in
                  </span>
                }
              />
            </Box>
          </Box>

          {/* Login Button - Half width, aligned with textboxes */}
          <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ minWidth: "80px" }}></Box>
              <Button
                type="submit"
                variant="contained"
                disabled={!formik.isValid || formik.isSubmitting}
                sx={{
                  backgroundColor: "#000",
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  padding: "14px 40px",
                  fontSize: "16px",
                  borderRadius: 1,
                  width: "50%",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                  "&:disabled": {
                    backgroundColor: "#666",
                    color: "#ccc",
                  },
                }}
              >
                LOGIN
              </Button>
            </Box>
          </Box>

          {/* Register Link - Centered */}
          <Box sx={{ width: "100%", mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "white", fontSize: "14px" }}
              >
                No account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="always"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textDecorationColor: "white",
                  }}
                >
                  Register here.
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default LoginForm;
