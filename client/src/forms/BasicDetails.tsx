import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";

interface BasicDetailsFormValues {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
// Update Props to use the defined type
interface Props {
  data?: Partial<BasicDetailsFormValues>; // Optional prefill values
  onUpdate: (values: BasicDetailsFormValues) => void;
}
const BasicDetails: React.FC<Props> = ({ data, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      salutation: data?.salutation || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
    },
    validationSchema: Yup.object({
      salutation: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="salutation-label">Salutation</InputLabel>
            <Select
              labelId="salutation-label"
              name="salutation"
              value={formik.values.salutation}
              onChange={formik.handleChange}
              error={
                formik.touched.salutation && Boolean(formik.errors.salutation)
              }
            >
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            value={formik.values.firstName}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            value={formik.values.lastName}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email Address"
            name="email"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
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

export default BasicDetails;
