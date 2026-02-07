import { createTheme } from "@mui/material/styles";

/**
 * CRYSTAL KAIROS Design System
 * MUI theme matching the landing page design
 */

// Color palette from design
const colors = {
  primary: {
    main: "#1A4CEB",
    light: "#E0E7FF",
    dark: "#1439C4",
  },
  secondary: {
    main: "#FFB800",
    light: "#FFD54F",
    dark: "#E6A600",
  },
  background: {
    default: "#F9FAFC",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    disabled: "#94A3B8",
  },
  border: {
    main: "#E2E8F0",
  },
} as const;

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: "#1E293B",
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Inter, 'Helvetica Neue', Arial, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      color: colors.text.primary,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
      color: colors.text.primary,
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.35,
      color: colors.text.primary,
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: colors.text.secondary,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: colors.text.secondary,
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
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "1rem",
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: "0px 8px 16px rgba(26, 76, 235, 0.2)",
          "&:hover": {
            boxShadow: "0px 12px 24px rgba(26, 76, 235, 0.3)",
            backgroundColor: colors.primary.dark,
          },
        },
        outlinedPrimary: {
          borderColor: colors.border.main,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
          "&:hover": {
            borderColor: colors.primary.main,
            backgroundColor: colors.primary.light,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.05)",
          border: `1px solid ${colors.border.main}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
        },
        filled: {
          "&.MuiChip-colorPrimary": {
            backgroundColor: colors.primary.light,
            color: colors.primary.main,
          },
        },
      },
    },
  },
});

export default theme;
