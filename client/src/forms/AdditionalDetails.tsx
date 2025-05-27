import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid } from "@mui/material";
import {
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";

interface AdditionalDetailsFormValues {
  address: string;
  country: string;
  postalCode: string;
  dob: string;
  gender: string;
  maritalStatus: string;
}

interface Props {
  data?: Partial<AdditionalDetailsFormValues>; // Optional prefill values
  onUpdate: (values: AdditionalDetailsFormValues) => void;
}

const today = new Date();
const seventeenYearsAgo = new Date(
  today.getFullYear() - 17,
  today.getMonth(),
  today.getDate()
);

const AdditionalDetails: React.FC<Props> = ({ data, onUpdate }) => {
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
      postalCode: Yup.string().required("Required"),
      dob: Yup.date()
        .max(seventeenYearsAgo, "Must be at least 17 years old")
        .required("Required"),
    }),
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Home Address"
            name="address"
            fullWidth
            value={formik.values.address}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            name="country"
            fullWidth
            value={formik.values.country}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Postal Code"
            name="postalCode"
            fullWidth
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            error={
              formik.touched.postalCode && Boolean(formik.errors.postalCode)
            }
            helperText={formik.touched.postalCode && formik.errors.postalCode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formik.values.dob}
            onChange={formik.handleChange}
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="marital-label">Marital Status</InputLabel>
            <Select
              labelId="marital-label"
              name="maritalStatus"
              value={formik.values.maritalStatus}
              onChange={formik.handleChange}
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default AdditionalDetails;
