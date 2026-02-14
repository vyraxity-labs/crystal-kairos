/**
 * CRYSTAL KAIROS Design Tokens
 * Single source of truth for MUI theme and Tailwind CSS (via generated CSS)
 * Run `pnpm generate:design-tokens` after changing tokens
 */

export const designTokens = {
  colors: {
    primary: {
      main: "#1A4CEB",
      light: "#E0E7FF",
      dark: "#1439C4",
    },
    accent: {
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
      muted: "#94A3B8",
    },
    border: "#E2E8F0",
  },
  radius: {
    button: "8px",
    card: "12px",
    pill: "9999px",
  },
  shadows: {
    card: "0 8px 20px rgba(0, 0, 0, 0.05)",
    buttonPrimary: "0 8px 16px rgba(26, 76, 235, 0.2)",
    buttonPrimaryHover: "0 12px 24px rgba(26, 76, 235, 0.3)",
    buttonSecondary: "0 4px 8px rgba(0, 0, 0, 0.05)",
  },
} as const;

// Convenience export for theme.ts
export const colors = designTokens.colors;
