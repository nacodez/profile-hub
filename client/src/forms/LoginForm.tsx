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
        const response = await axiosInstance.post("/auth/login", values);
        onSuccess();
      } catch (err: unknown) {
        // handle different error types
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
                  onClick={handleClickShowPassword}
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

        <FormControlLabel
          control={
            <Checkbox
              name="keepLoggedIn"
              checked={formik.values.keepLoggedIn}
              onChange={formik.handleChange}
              size="small"
            />
          }
          label="Keep me logged in"
          sx={{ alignSelf: "flex-start", fontSize: "14px" }}
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
          LOGIN
        </Button>
      </Box>
    </form>
  );
};

export default LoginForm;
