import type { Preset, Preflight } from 'unocss'

/**
 * WTheme - UnoCSS preset for Wrikka design system
 * Provides theme colors with CSS variables (HSL format)
 */

export interface WThemeOptions {
  /**
   * Enable dark mode
   * @default true
   */
  darkMode?: boolean

  /**
   * Customize color values
   */
  colors?: {
    primary?: string
    secondary?: string
    success?: string
    warning?: string
    destructive?: string
  }
}

/**
 * Default theme colors in HSL format
 */
const defaultColors = {
  primary: {
    DEFAULT: 'hsl(var(--color-primary))',
    hover: 'hsl(var(--color-primary-hover))',
    active: 'hsl(var(--color-primary-active))',
    foreground: 'hsl(var(--color-primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--color-secondary))',
    hover: 'hsl(var(--color-secondary-hover))',
    active: 'hsl(var(--color-secondary-active))',
    foreground: 'hsl(var(--color-secondary-foreground))',
  },
  success: {
    DEFAULT: 'hsl(var(--color-success))',
    foreground: 'hsl(var(--color-success-foreground))',
  },
  warning: {
    DEFAULT: 'hsl(var(--color-warning))',
    foreground: 'hsl(var(--color-warning-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--color-destructive))',
    hover: 'hsl(var(--color-destructive-hover))',
    active: 'hsl(var(--color-destructive-active))',
    foreground: 'hsl(var(--color-destructive-foreground))',
  },
  background: {
    DEFAULT: 'hsl(var(--color-background))',
  },
  foreground: {
    DEFAULT: 'hsl(var(--color-foreground))',
  },
  surface: {
    DEFAULT: 'hsl(var(--color-surface))',
    elevated: 'hsl(var(--color-surface-elevated))',
    foreground: 'hsl(var(--color-surface-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--color-muted))',
    foreground: 'hsl(var(--color-muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--color-accent))',
    hover: 'hsl(var(--color-accent-hover))',
    foreground: 'hsl(var(--color-accent-foreground))',
  },
  border: {
    DEFAULT: 'hsl(var(--color-border))',
    hover: 'hsl(var(--color-border-hover))',
  },
  focus: {
    DEFAULT: 'hsl(var(--color-focus))',
  },
  overlay: {
    DEFAULT: 'hsl(var(--color-overlay))',
  },
  skeleton: {
    DEFAULT: 'hsl(var(--color-skeleton))',
    shine: 'hsl(var(--color-skeleton-shine))',
  },
}

/**
 * Generate preflight CSS with CSS variables
 */
function generateThemeCSS(_options: WThemeOptions): Preflight {
  return {
    getCSS: () => `
:root {
  /* Primary colors */
  --color-primary: 221 83% 53%;
  --color-primary-hover: 221 83% 45%;
  --color-primary-active: 221 83% 37%;
  --color-primary-foreground: 0 0% 100%;

  /* Secondary colors */
  --color-secondary: 238 84% 67%;
  --color-secondary-hover: 238 84% 59%;
  --color-secondary-active: 238 84% 51%;
  --color-secondary-foreground: 0 0% 100%;

  /* Status colors */
  --color-success: 142 76% 36%;
  --color-success-foreground: 0 0% 100%;

  --color-warning: 38 92% 50%;
  --color-warning-foreground: 0 0% 100%;

  /* Destructive colors */
  --color-destructive: 0 84% 60%;
  --color-destructive-hover: 0 84% 56%;
  --color-destructive-active: 0 84% 52%;
  --color-destructive-foreground: 0 0% 100%;

  /* Base colors */
  --color-background: 0 0% 100%;
  --color-foreground: 220 13% 18%;

  /* Surface colors */
  --color-surface: 0 0% 100%;
  --color-surface-elevated: 0 0% 100%;
  --color-surface-foreground: 220 13% 18%;

  /* Interaction colors */
  --color-muted: 220 13% 96%;
  --color-muted-foreground: 220 13% 42%;

  --color-accent: 221 83% 53%;
  --color-accent-hover: 221 83% 45%;
  --color-accent-foreground: 0 0% 100%;

  /* Border and focus */
  --color-border: 220 13% 82%;
  --color-border-hover: 220 13% 60%;
  --color-focus: 221 83% 53%;

  /* Overlay */
  --color-overlay: 0 0% 0%;

  /* Skeleton */
  --color-skeleton: 220 13% 82%;
  --color-skeleton-shine: 220 13% 96%;
}

.dark {
  /* Primary colors */
  --color-primary: 221 83% 63%;
  --color-primary-hover: 221 83% 55%;
  --color-primary-active: 221 83% 47%;
  --color-primary-foreground: 0 0% 100%;

  /* Secondary colors */
  --color-secondary: 238 84% 77%;
  --color-secondary-hover: 238 84% 69%;
  --color-secondary-active: 238 84% 61%;
  --color-secondary-foreground: 0 0% 100%;

  /* Status colors */
  --color-success: 142 76% 46%;
  --color-success-foreground: 0 0% 100%;

  --color-warning: 38 92% 60%;
  --color-warning-foreground: 0 0% 100%;

  /* Destructive colors */
  --color-destructive: 0 84% 70%;
  --color-destructive-hover: 0 84% 66%;
  --color-destructive-active: 0 84% 62%;
  --color-destructive-foreground: 0 0% 100%;

  /* Base colors */
  --color-background: 220 13% 7%;
  --color-foreground: 220 13% 97%;

  /* Surface colors */
  --color-surface: 220 13% 10%;
  --color-surface-elevated: 220 13% 15%;
  --color-surface-foreground: 220 13% 97%;

  /* Interaction colors */
  --color-muted: 220 13% 22%;
  --color-muted-foreground: 220 13% 60%;

  --color-accent: 221 83% 63%;
  --color-accent-hover: 221 83% 55%;
  --color-accent-foreground: 0 0% 100%;

  /* Border and focus */
  --color-border: 220 13% 30%;
  --color-border-hover: 220 13% 42%;
  --color-focus: 221 83% 63%;

  /* Overlay */
  --color-overlay: 0 0% 0%;

  /* Skeleton */
  --color-skeleton: 220 13% 30%;
  --color-skeleton-shine: 220 13% 22%;
}
`,
  }
}

/**
 * WTheme preset factory
 */
export function presetWtheme(options: WThemeOptions = {}): Preset {
  const { darkMode = true } = options

  return {
    name: 'wtheme',
    theme: {
      colors: defaultColors,
    },
    preflights: darkMode ? [generateThemeCSS(options)] : [],
  }
}

export default presetWtheme
