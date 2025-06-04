import React, { useCallback, useRef } from "react";
import { useFormik } from "formik";
import { Box } from "@mui/material";
import CustomTextField from "../components/CustomTextField";
import type { Preferences as PreferencesType } from "../types";

interface Props {
  data?: Partial<PreferencesType>;
  onUpdate: (values: PreferencesType) => void;
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
    (values: PreferencesType) => {
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
    }, 800);
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
            <CustomTextField
              label="Hobbies and Interests"
              name="hobbies"
              fullWidth
              multiline
              minRows={3}
              value={formik.values.hobbies}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              placeholder="Tell us about your hobbies and interests..."
            />
            <CustomTextField
              label="Favorite Sport(s)"
              name="sports"
              fullWidth
              value={formik.values.sports}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              placeholder="What sports do you enjoy?"
            />
            <CustomTextField
              label="Preferred Music Genre(s)"
              name="music"
              fullWidth
              value={formik.values.music}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              placeholder="What music genres do you prefer?"
            />
            <CustomTextField
              label="Preferred Movie/TV Show(s)"
              name="movies"
              fullWidth
              value={formik.values.movies}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              placeholder="What movies or TV shows do you enjoy?"
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default Preferences;
