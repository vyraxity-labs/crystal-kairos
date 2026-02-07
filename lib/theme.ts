import { createTheme } from "@mui/material/styles";

/**
 * CRYSTAL KAIROS Design System
 * MUI theme referencing CSS variables from globals.css as single source of truth
 */

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "var(--color-primary)",
      light: "var(--color-primary-light)",
      dark: "var(--color-primary-dark)",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "var(--color-accent)",
      light: "var(--color-accent-light)",
      dark: "var(--color-accent-dark)",
      contrastText: "var(--color-text-primary)",
    },
    background: {
      default: "var(--color-bg-main)",
      paper: "var(--color-bg-paper)",
    },
    text: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      disabled: "var(--color-text-muted)",
    },
  },
  typography: {
    fontFamily: "var(--font-sans)",
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      color: "var(--color-text-primary)",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
      color: "var(--color-text-primary)",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.35,
      color: "var(--color-text-primary)",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      color: "var(--color-text-primary)",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      color: "var(--color-text-primary)",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      color: "var(--color-text-primary)",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "var(--color-text-secondary)",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "var(--color-text-secondary)",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "var(--radius-button)",
          padding: "10px 24px",
          fontSize: "1rem",
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: "var(--shadow-button-primary)",
          "&:hover": {
            boxShadow: "var(--shadow-button-primary-hover)",
            backgroundColor: "var(--color-primary-dark)",
          },
        },
        outlinedPrimary: {
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-button-secondary)",
          "&:hover": {
            borderColor: "var(--color-primary)",
            backgroundColor: "var(--color-primary-light)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--color-border)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "var(--radius-pill)",
        },
        filled: {
          "&.MuiChip-colorPrimary": {
            backgroundColor: "var(--color-primary-light)",
            color: "var(--color-primary)",
          },
        },
      },
    },
  },
});

export default theme;
