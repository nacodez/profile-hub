import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance"; // Used for requests
import axios from "axios"; // Used for isAxiosError

interface Props {
  onSuccess: () => void;
}

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
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
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await axiosInstance.post("/auth/login", values);
        onSuccess();
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setErrors({ password: "Invalid credentials" });
          } else {
            console.error("Login error:", err.message);
          }
        } else {
          console.error("Unexpected error:", err);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="User ID"
          name="userId"
          fullWidth
          value={formik.values.userId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.userId && Boolean(formik.errors.userId)}
          helperText={formik.touched.userId && formik.errors.userId}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="keepLoggedIn"
              checked={formik.values.keepLoggedIn}
              onChange={formik.handleChange}
            />
          }
          label="Keep me logged in"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Login
        </Button>
      </Box>
    </form>
  );
};

export default LoginForm;
