import React from "react";
import {
  FormControl,
  Select,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import type { CustomSelectProps } from "../types";

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  error = false,
  helperText,
  fullWidth = false,
  formControlProps,
  sx,
  children,
  ...selectProps
}) => {
  return (
    <Box sx={{ position: "relative" }}>
      {/* Separate Label */}
      <Typography
        component="label"
        sx={{
          display: "block",
          fontSize: "14px",
          fontWeight: "500",
          color: error ? "#d32f2f" : "#666",
          marginBottom: "4px",
        }}
      >
        {label}
      </Typography>

      <FormControl fullWidth={fullWidth} error={error} {...formControlProps}>
        <Select
          {...selectProps}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 1,
            "& .MuiSelect-select": {
              padding: "12px 14px",
            },
            "& fieldset": {
              borderColor: error ? "#d32f2f" : "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: error ? "#d32f2f" : "rgba(0, 0, 0, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: error ? "#d32f2f" : "#1976d2",
            },
            ...sx,
          }}
        >
          {children}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default CustomSelect;
