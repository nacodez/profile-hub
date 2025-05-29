import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

interface AdditionalDetailsFormValues {
  address: string;
  country: string;
  postalCode: string;
  dob: string;
  gender: string;
  maritalStatus: string;
}

interface Props {
  data?: Partial<AdditionalDetailsFormValues>;
  onUpdate: (values: AdditionalDetailsFormValues) => void;
}

const today = new Date();
const minDate = new Date(
  today.getFullYear() - 17,
  today.getMonth(),
  today.getDate()
);

const AdditionalDetails: React.FC<Props> = ({ data, onUpdate }) => {
  const lastUpdateRef = useRef<string>("");

  const formik = useFormik({
    initialValues: {
      address: data?.address || "",
      country: data?.country || "",
      postalCode: data?.postalCode || "",
      dob: data?.dob || "",
      gender: data?.gender || "",
      maritalStatus: data?.maritalStatus || "",
    },
    validationSchema: Yup.object({
      postalCode: Yup.string().required("Postal code is required"),
      dob: Yup.date()
        .max(minDate, "Must be at least 17 years old")
        .required("Date of birth is required"),
    }),
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  const debouncedUpdate = useCallback(
    (values: AdditionalDetailsFormValues) => {
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
      debouncedUpdate({
        ...formik.values,
        [event.target.name]: event.target.value,
      });
    }, 500);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    formik.handleChange(event);

    setTimeout(() => {
      debouncedUpdate({
        ...formik.values,
        [event.target.name]: event.target.value,
      });
    }, 100);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
        >
          Additional Details
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Fields marked with * are mandatory field
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Home Address */}
          <TextField
            label="Home Address"
            name="address"
            fullWidth
            multiline
            rows={2}
            value={formik.values.address}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />

          {/* Country */}
          <TextField
            label="Country"
            name="country"
            fullWidth
            value={formik.values.country}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />

          {/* Postal Code */}
          <TextField
            label="Postal Code*"
            name="postalCode"
            fullWidth
            value={formik.values.postalCode}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.postalCode && Boolean(formik.errors.postalCode)
            }
            helperText={formik.touched.postalCode && formik.errors.postalCode}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />

          {/* Date of Birth */}
          <TextField
            label="Date of Birth*"
            name="dob"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formik.values.dob}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />

          {/* Gender */}
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formik.values.gender}
              onChange={handleSelectChange}
              onBlur={formik.handleBlur}
              label="Gender"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <MenuItem value="">
                <em>Select gender</em>
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Marital Status */}
          <FormControl fullWidth>
            <InputLabel id="marital-label">Marital Status</InputLabel>
            <Select
              labelId="marital-label"
              name="maritalStatus"
              value={formik.values.maritalStatus}
              onChange={handleSelectChange}
              onBlur={formik.handleBlur}
              label="Marital Status"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <MenuItem value="">
                <em>Select marital status</em>
              </MenuItem>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
          </FormControl>

          {/* Mandatory field note */}
          <Typography variant="body2" sx={{ color: "#666", fontSize: "12px" }}>
            * Mandatory field
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default AdditionalDetails;
