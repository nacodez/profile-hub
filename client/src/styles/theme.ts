export const theme = {
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
  },

  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
  },

  responsiveContainer: {
    px: { xs: 1, sm: 2, md: 3 },
    width: "100%",
  },

  responsiveTitle: {
    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
    fontWeight: "bold",
    textAlign: "center",
  },

  responsiveText: {
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },

  formContainer: {
    width: "100%",
    maxWidth: { xs: "100%", sm: "400px" },
    px: { xs: 2, sm: 0 },
  },

  mobileFormField: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    gap: { xs: 1, sm: 2 },
    width: "100%",
  },

  mobileFormLabel: {
    fontSize: { xs: "14px", sm: "16px" },
    fontWeight: "500",
    minWidth: { xs: "auto", sm: "120px" },
    width: { xs: "100%", sm: "auto" },
  },
};
