import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import { TextField, Box, Typography } from "@mui/material";

interface PreferencesFormValues {
  hobbies?: string;
  sports?: string;
  music?: string;
  movies?: string;
}

interface Props {
  data?: Partial<PreferencesFormValues>;
  onUpdate: (values: PreferencesFormValues) => void;
}

const Preferences: React.FC<Props> = ({ data, onUpdate }) => {
  const lastUpdateRef = useRef<string>("");

  const formik = useFormik({
    initialValues: {
      hobbies: data?.hobbies || "",
      sports: data?.sports || "",
      music: data?.music || "",
      movies: data?.movies || "",
    },
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  const debouncedUpdate = useCallback(
    (values: PreferencesFormValues) => {
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
    }, 800); // Longer delay for text areas
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
        >
          Personal Preferences
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Tell us about your interests and preferences
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Hobbies and Interests */}
          <TextField
            label="Hobbies and Interests"
            name="hobbies"
            fullWidth
            multiline
            minRows={3}
            value={formik.values.hobbies}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            placeholder="Tell us about your hobbies and interests..."
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />

          {/* Favorite Sport(s) */}
          <TextField
            label="Favorite Sport(s)"
            name="sports"
            fullWidth
            value={formik.values.sports}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            placeholder="What sports do you enjoy?"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />

          {/* Preferred Music Genre(s) */}
          <TextField
            label="Preferred Music Genre(s)"
            name="music"
            fullWidth
            value={formik.values.music}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            placeholder="What music genres do you prefer?"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />

          {/* Preferred Movie/TV Show(s) */}
          <TextField
            label="Preferred Movie/TV Show(s)"
            name="movies"
            fullWidth
            value={formik.values.movies}
            onChange={handleFieldChange}
            onBlur={formik.handleBlur}
            placeholder="What movies or TV shows do you enjoy?"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />
        </Box>
      </form>
    </Box>
  );
};

export default Preferences;
