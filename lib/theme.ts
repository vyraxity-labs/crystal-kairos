import { createTheme } from '@mui/material/styles'
import { designTokens } from './designTokens'

const { colors, radius, shadows } = designTokens

/**
 * CRYSTAL KAIROS Design System
 * MUI theme - palette uses designTokens (MUI requires literal colors, not CSS vars)
 * Component overrides use CSS vars where MUI accepts them (shadows, radius)
 */

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.accent.main,
      light: colors.accent.light,
      dark: colors.accent.dark,
      contrastText: colors.text.primary,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.muted,
    },
  },
  typography: {
    fontFamily: 'var(--font-sans)',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.text.primary,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      color: colors.text.primary,
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.35,
      color: colors.text.primary,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.text.secondary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: parseInt(radius.button, 10),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(radius.button, 10),
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: shadows.buttonPrimary,
          '&:hover': {
            boxShadow: shadows.buttonPrimaryHover,
            backgroundColor: colors.primary.dark,
          },
        },
        outlinedPrimary: {
          borderColor: colors.border,
          boxShadow: shadows.buttonSecondary,
          '&:hover': {
            borderColor: colors.primary.main,
            backgroundColor: colors.primary.light,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(radius.card, 10),
          boxShadow: shadows.card,
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(radius.pill, 10),
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: colors.primary.light,
            color: colors.primary.main,
          },
        },
      },
    },
  },
})

export default theme
