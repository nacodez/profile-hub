import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
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

const RegisterForm: React.FC<Props> = ({ onSuccess, onError }) => {
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="User ID"
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
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        />

        <TextField
          label="Confirm Password"
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
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
          sx={{
            backgroundColor: "#000",
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
            padding: "12px",
            "&:hover": {
              backgroundColor: "#333",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            },
          }}
        >
          Register
        </Button>
      </Box>
    </form>
  );
};

export default RegisterForm;
