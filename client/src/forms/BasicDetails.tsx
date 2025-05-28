import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

interface BasicDetailsFormValues {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Props {
  data?: Partial<BasicDetailsFormValues>;
  onUpdate: (values: BasicDetailsFormValues) => void;
}

const BasicDetails: React.FC<Props> = ({ data, onUpdate }) => {
  const lastUpdateRef = useRef<string>("");

  const formik = useFormik({
    initialValues: {
      salutation: data?.salutation || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
    },
    validationSchema: Yup.object({
      salutation: Yup.string().required("Please select your salutation."),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email address is required"),
    }),
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  // Debounced update function
  const debouncedUpdate = useCallback(
    (values: BasicDetailsFormValues) => {
      const currentValues = JSON.stringify(values);
      if (currentValues !== lastUpdateRef.current) {
        lastUpdateRef.current = currentValues;
        onUpdate(values);
      }
    },
    [onUpdate]
  );

  // Handle field changes with debouncing
  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formik.handleChange(event);

    // Use setTimeout to debounce updates
    setTimeout(() => {
      if (formik.isValid) {
        debouncedUpdate({
          ...formik.values,
          [event.target.name]: event.target.value,
        });
      }
    }, 300);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    formik.handleChange(event);

    setTimeout(() => {
      if (formik.isValid) {
        debouncedUpdate({
          ...formik.values,
          [event.target.name]: event.target.value,
        });
      }
    }, 300);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Basic Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fields marked with * are mandatory field
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl
              fullWidth
              error={
                formik.touched.salutation && Boolean(formik.errors.salutation)
              }
            >
              <InputLabel id="salutation-label">Salutation*</InputLabel>
              <Select
                labelId="salutation-label"
                name="salutation"
                value={formik.values.salutation}
                onChange={handleSelectChange}
                onBlur={formik.handleBlur}
                label="Salutation*"
                displayEmpty
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <MenuItem value="">
                  <em>Select salutation</em>
                </MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
              </Select>
              {formik.touched.salutation && formik.errors.salutation && (
                <FormHelperText>{formik.errors.salutation}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="First name*"
              name="firstName"
              fullWidth
              value={formik.values.firstName}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Last name*"
              name="lastName"
              fullWidth
              value={formik.values.lastName}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email address*"
              name="email"
              type="email"
              fullWidth
              value={formik.values.email}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default BasicDetails;
