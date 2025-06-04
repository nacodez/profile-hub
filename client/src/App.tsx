import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipNavigation from "./components/SkipNavigation";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4A90E2",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#333333",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 600 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.75rem", fontWeight: 600 },
    h4: { fontSize: "1.5rem", fontWeight: 600 },
    h5: { fontSize: "1.25rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <SkipNavigation />
          <AuthProvider>
            <main id="main-content" role="main">
              <AppRoutes />
            </main>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
