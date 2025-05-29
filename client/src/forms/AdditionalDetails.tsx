import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MenuItem, Box, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../components/CustomTextField";
import CustomSelect from "../components/CustomSelect";

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
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ maxWidth: "sm" }}
        >
          {/* Home Address */}
          <CustomTextField
            label="Home Address"
            name="address"
            fullWidth
            multiline
            rows={2}
            value={formik.values.address}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
          />

          {/* Country */}
          <CustomTextField
            label="Country"
            name="country"
            fullWidth
            value={formik.values.country}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
          />

          {/* Postal Code */}
          <CustomTextField
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
          />

          {/* Date of Birth */}
          <CustomTextField
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
          />

          {/* Gender */}
          <CustomSelect
            label="Gender"
            name="gender"
            fullWidth
            value={formik.values.gender}
            onChange={handleSelectChange}
            onBlur={formik.handleBlur}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select gender</em>
            </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </CustomSelect>

          {/* Marital Status */}
          <CustomSelect
            label="Marital Status"
            name="maritalStatus"
            fullWidth
            value={formik.values.maritalStatus}
            onChange={handleSelectChange}
            onBlur={formik.handleBlur}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select marital status</em>
            </MenuItem>
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Divorced">Divorced</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
          </CustomSelect>

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
