import React from "react";
import { TextField, Box, Typography } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

interface CustomTextFieldProps extends Omit<TextFieldProps, "label"> {
  label: string;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  sx,
  error,
  ...props
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

      {/* TextField without label */}
      <TextField
        {...props}
        error={error}
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
            padding: "0px !important", // Override multiline padding
          },
          ...sx,
        }}
      />
    </Box>
  );
};

export default CustomTextField;
