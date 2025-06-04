import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MenuItem, Box } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CustomTextField from "../components/CustomTextField";
import CustomSelect from "../components/CustomSelect";
import type {
  AdditionalDetails as AdditionalDetailsType,
  AdditionalDetailsProps,
} from "../types";

const today = new Date();
const minDate = new Date(
  today.getFullYear() - 17,
  today.getMonth(),
  today.getDate()
);

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  data,
  onUpdate,
}) => {
  const lastUpdateRef = useRef<string>("");

  const formik = useFormik({
    initialValues: {
      address: data?.address || "",
      country: data?.country || "",
      postalCode: data?.postalCode || "",
      dob: data?.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
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
    (values: AdditionalDetailsType) => {
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
            flex={1}
            sx={{ maxWidth: "sm" }}
          >
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
            <CustomTextField
              label="Country"
              name="country"
              fullWidth
              value={formik.values.country}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
            />
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
              inputProps={{
                max: minDate.toISOString().split("T")[0],
              }}
            />
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
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default AdditionalDetails;
