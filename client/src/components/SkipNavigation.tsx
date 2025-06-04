import React from "react";
import { Box, Link } from "@mui/material";

const SkipNavigation: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        "&:focus": {
          position: "fixed",
          top: 10,
          left: 10,
          width: "auto",
          height: "auto",
          padding: 2,
          backgroundColor: "primary.main",
          color: "white",
          textDecoration: "none",
          borderRadius: 1,
          zIndex: 10000,
        },
      }}
    >
      <Link href="#main-content" color="inherit">
        Skip to main content
      </Link>
    </Box>
  );
};

export default SkipNavigation;
