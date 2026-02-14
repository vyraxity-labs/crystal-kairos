/**
 * Injects design tokens from lib/designTokens.ts into app/globals.css
 * Replaces content between GENERATED_TOKENS_START and GENERATED_TOKENS_END
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { designTokens } from "../lib/designTokens";

const tokensCss = `@theme {
  /* Brand colors → bg-primary, text-primary, etc. */
  --color-primary: ${designTokens.colors.primary.main.toLowerCase()};
  --color-primary-light: ${designTokens.colors.primary.light.toLowerCase()};
  --color-primary-dark: ${designTokens.colors.primary.dark.toLowerCase()};

  /* Accent */
  --color-accent: ${designTokens.colors.accent.main.toLowerCase()};
  --color-accent-light: ${designTokens.colors.accent.light.toLowerCase()};
  --color-accent-dark: ${designTokens.colors.accent.dark.toLowerCase()};

  /* Surfaces */
  --color-bg-main: ${designTokens.colors.background.default.toLowerCase()};
  --color-bg-paper: ${designTokens.colors.background.paper.toLowerCase()};

  /* Text */
  --color-text-primary: ${designTokens.colors.text.primary.toLowerCase()};
  --color-text-secondary: ${designTokens.colors.text.secondary.toLowerCase()};
  --color-text-muted: ${designTokens.colors.text.muted.toLowerCase()};

  /* Border */
  --color-border: ${designTokens.colors.border.toLowerCase()};

  /* Fonts - Geist loaded in layout */
  --font-sans: var(--font-geist-sans, ui-sans-serif, system-ui, Inter, sans-serif);
  --font-mono: var(--font-geist-mono, ui-monospace, monospace);

  /* Border radius */
  --radius-button: ${designTokens.radius.button};
  --radius-card: ${designTokens.radius.card};
  --radius-pill: ${designTokens.radius.pill};

  /* Shadows */
  --shadow-card: ${designTokens.shadows.card};
  --shadow-button-primary: ${designTokens.shadows.buttonPrimary};
  --shadow-button-primary-hover: ${designTokens.shadows.buttonPrimaryHover};
  --shadow-button-secondary: ${designTokens.shadows.buttonSecondary};
}

:root {
  --background: var(--color-bg-main);
  --foreground: var(--color-text-primary);
}
`;

const globalsPath = join(process.cwd(), "app", "globals.css");
let content = readFileSync(globalsPath, "utf-8");

const startMarker = "/* GENERATED_TOKENS_START - Do not edit. Run: pnpm generate:design-tokens */";
const endMarker = "/* GENERATED_TOKENS_END */";

if (!content.includes(startMarker) || !content.includes(endMarker)) {
  throw new Error("globals.css must contain GENERATED_TOKENS_START and GENERATED_TOKENS_END markers");
}

const startIdx = content.indexOf(startMarker) + startMarker.length;
const endIdx = content.indexOf(endMarker);
content = content.slice(0, startIdx) + "\n" + tokensCss + "\n" + content.slice(endIdx);
writeFileSync(globalsPath, content, "utf-8");

console.log("✓ Injected design tokens into app/globals.css");
