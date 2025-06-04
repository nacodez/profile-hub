import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import axios from "../api/axiosInstance";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { ApiErrorHandler } from "../utils/apiErrorHandler";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      const errors = ApiErrorHandler.handle(err);
      setError(ApiErrorHandler.getGeneralError(errors));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box textAlign="center">
              <Email sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Check Your Email
              </Typography>
              <Typography color="text.secondary" paragraph>
                If an account exists with {email}, you will receive a password
                reset link shortly.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Didn't receive an email? Check your spam folder or{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                >
                  try again
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Forgot Password
          </Typography>
          <Typography color="text.secondary" paragraph align="center">
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>

          {error && <AlertMessage type="error" message={error} />}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !email}
            >
              {loading ? <LoadingSpinner size={24} /> : "Send Reset Link"}
            </Button>

            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Back to Login
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
