import React from "react";
import { useFormik } from "formik";
import { TextField, Grid, Button, Box } from "@mui/material";

interface PreferencesFormValues {
  hobbies?: string;
  sports?: string;
  music?: string;
  movies?: string;
}
interface Props {
  data?: Partial<PreferencesFormValues>; // Optional prefill values
  onUpdate: (values: PreferencesFormValues) => void;
}

const Preferences: React.FC<Props> = ({ data, onUpdate }) => {
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Hobbies and Interests"
            name="hobbies"
            fullWidth
            multiline
            minRows={2}
            value={formik.values.hobbies}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Favorite Sport(s)"
            name="sports"
            fullWidth
            value={formik.values.sports}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Preferred Music Genre(s)"
            name="music"
            fullWidth
            value={formik.values.music}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Preferred Movie/TV Show(s)"
            name="movies"
            fullWidth
            value={formik.values.movies}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default Preferences;
