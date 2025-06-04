import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import { MenuItem, Box } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../components/CustomTextField";
import CustomSelect from "../components/CustomSelect";
import type {
  SpouseDetails as SpouseDetailsType,
  SpouseDetailsProps,
} from "../types";

const SpouseDetails: React.FC<SpouseDetailsProps> = ({ data, onUpdate }) => {
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
    (values: SpouseDetailsType) => {
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

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target as { name: string; value: string };
    formik.setFieldValue(name, value);

    setTimeout(() => {
      debouncedUpdate({
        ...formik.values,
        [name]: value,
      });
    }, 100);
  };

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" justifyContent={"center"}>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ maxWidth: "sm" }}
            flex={1}
          >
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
            <CustomTextField
              label="First Name"
              name="firstName"
              fullWidth
              value={formik.values.firstName}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
            />
            <CustomTextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={formik.values.lastName}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default SpouseDetails;
