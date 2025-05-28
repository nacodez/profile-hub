import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  IconButton,
  InputAdornment,
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
    <Box sx={{ maxWidth: 400, mx: "auto" }}>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2.5}>
          {/* User ID Field */}
          <Box>
            <Box sx={{ textAlign: "left", mb: 0.5 }}>
              <span
                style={{ color: "white", fontSize: "16px", fontWeight: "500" }}
              >
                User ID*
              </span>
            </Box>
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

          {/* Password Field */}
          <Box>
            <Box sx={{ textAlign: "left", mb: 0.5 }}>
              <span
                style={{ color: "white", fontSize: "16px", fontWeight: "500" }}
              >
                Password*
              </span>
            </Box>
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
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

          {/* Keep me logged in checkbox */}
          <Box sx={{ textAlign: "left", mt: 1 }}>
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

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!formik.isValid || formik.isSubmitting}
            sx={{
              backgroundColor: "#000",
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              padding: "14px",
              fontSize: "16px",
              mt: 2,
              borderRadius: 1,
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
      </form>
    </Box>
  );
};

export default LoginForm;
