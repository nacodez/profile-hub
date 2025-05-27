import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import axios from "axios"; // for isAxiosError

interface Props {
  onSuccess: () => void;
}

const RegisterForm: React.FC<Props> = ({ onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("User ID is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Your passwords do not match."),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await axiosInstance.post("/auth/register", {
          userId: values.userId,
          password: values.password,
        });
        onSuccess();
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setErrors({ userId: "User ID already exists" });
          } else {
            console.error("Register error:", err.message);
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

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
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
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Register
        </Button>
      </Box>
    </form>
  );
};

export default RegisterForm;
