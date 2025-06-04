import React from "react";
import { TextField, Box, Typography } from "@mui/material";
import type { CustomTextFieldProps } from "../types";

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  sx,
  error,
  helperText,
  id,
  required,
  ...props
}) => {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  return (
    <Box sx={{ position: "relative" }}>
      <Typography
        component="label"
        htmlFor={fieldId}
        sx={{
          display: "block",
          fontSize: "14px",
          fontWeight: "500",
          color: error ? "#d32f2f" : "#666",
          marginBottom: "4px",
        }}
      >
        {label}
        {required && (
          <span aria-label="required" style={{ color: "#d32f2f" }}>
            {" "}
            *
          </span>
        )}
      </Typography>

      <TextField
        {...props}
        id={fieldId}
        error={error}
        aria-invalid={error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-required={required}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 1,
            "& fieldset": {
              borderColor: error ? "#d32f2f" : "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: error ? "#d32f2f" : "rgba(0, 0, 0, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: error ? "#d32f2f" : "#1976d2",
            },
          },
          "& .MuiInputBase-input": {
            padding: "12px 14px",
          },
          "& .MuiInputBase-inputMultiline": {
            padding: "0px !important",
          },
          ...sx,
        }}
      />

      {(error || helperText) && (
        <Typography
          variant="caption"
          id={error ? errorId : helperId}
          role={error ? "alert" : undefined}
          sx={{
            color: error ? "#d32f2f" : "text.secondary",
            mt: 0.5,
            display: "block",
          }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  );
};

export default CustomTextField;
