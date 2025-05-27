import React from "react";
import { useFormik } from "formik";
import {
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Button,
  Box,
} from "@mui/material";

interface SpouseDetailsFormValues {
  salutation?: string;
  firstName?: string;
  lastName?: string;
}
interface Props {
  data?: Partial<SpouseDetailsFormValues>; // Optional prefill values
  onUpdate: (values: SpouseDetailsFormValues) => void;
}
const SpouseDetails: React.FC<Props> = ({ data, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      salutation: data?.salutation || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
    },
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
          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default SpouseDetails;
