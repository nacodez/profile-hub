import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import { MenuItem, Box, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../components/CustomTextField";
import CustomSelect from "../components/CustomSelect";

interface SpouseDetailsFormValues {
  salutation?: string;
  firstName?: string;
  lastName?: string;
}

interface Props {
  data?: Partial<SpouseDetailsFormValues>;
  onUpdate: (values: SpouseDetailsFormValues) => void;
}

const SpouseDetails: React.FC<Props> = ({ data, onUpdate }) => {
  const lastUpdateRef = useRef<string>("");

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

  const debouncedUpdate = useCallback(
    (values: SpouseDetailsFormValues) => {
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
          Spouse Details
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Please provide your spouse's information
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ maxWidth: "sm" }}
          ml={17}
        >
          {/* Salutation */}
          <CustomSelect
            label="Salutation"
            name="salutation"
            fullWidth
            value={formik.values.salutation}
            onChange={handleSelectChange}
            onBlur={formik.handleBlur}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select salutation</em>
            </MenuItem>
            <MenuItem value="Mr.">Mr.</MenuItem>
            <MenuItem value="Ms.">Ms.</MenuItem>
            <MenuItem value="Mrs.">Mrs.</MenuItem>
          </CustomSelect>

          {/* First Name */}
          <CustomTextField
            label="First Name"
            name="firstName"
            fullWidth
            value={formik.values.firstName}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
          />

          {/* Last Name */}
          <CustomTextField
            label="Last Name"
            name="lastName"
            fullWidth
            value={formik.values.lastName}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
          />
        </Box>
      </form>
    </Box>
  );
};

export default SpouseDetails;
