/**
 * UnoCSS Theme Configuration with Design Tokens
 * Supports light and dark modes
 */

export const unoTheme = {
	// CSS Variables for Design Tokens
	theme: {
		extend: {
			colors: {
				// Text Colors
				"prose-text-primary": "var(--prose-text-primary)",
				"prose-text-secondary": "var(--prose-text-secondary)",
				"prose-text-tertiary": "var(--prose-text-tertiary)",

				// Background Colors
				"prose-bg-primary": "var(--prose-bg-primary)",
				"prose-bg-secondary": "var(--prose-bg-secondary)",

				// Border Colors
				"prose-border-default": "var(--prose-border-default)",
				"prose-border-light": "var(--prose-border-light)",

				// Code Colors
				"prose-code-bg": "var(--prose-code-bg)",
				"prose-code-text": "var(--prose-code-text)",
				"prose-code-border": "var(--prose-code-border)",

				// Link Colors
				"prose-link-default": "var(--prose-link-default)",
				"prose-link-hover": "var(--prose-link-hover)",
				"prose-link-visited": "var(--prose-link-visited)",
			},
			fontSize: {
				"prose-h1": "var(--prose-h1-size)",
				"prose-h2": "var(--prose-h2-size)",
				"prose-h3": "var(--prose-h3-size)",
				"prose-h4": "var(--prose-h4-size)",
				"prose-h5": "var(--prose-h5-size)",
				"prose-h6": "var(--prose-h6-size)",
				"prose-body": "var(--prose-body-size)",
				"prose-small": "var(--prose-small-size)",
				"prose-code": "var(--prose-code-size)",
			},
			fontFamily: {
				"prose-sans": "var(--prose-font-sans)",
				"prose-serif": "var(--prose-font-serif)",
				"prose-mono": "var(--prose-font-mono)",
			},
			lineHeight: {
				"prose-tight": "var(--prose-line-tight)",
				"prose-normal": "var(--prose-line-normal)",
				"prose-relaxed": "var(--prose-line-relaxed)",
			},
			spacing: {
				"prose-xs": "0.25rem",
				"prose-sm": "0.5rem",
				"prose-md": "1rem",
				"prose-lg": "1.5rem",
				"prose-xl": "2rem",
				"prose-2xl": "3rem",
				"prose-3xl": "4rem",
			},
			borderRadius: {
				"prose-sm": "0.25rem",
				"prose-md": "0.5rem",
				"prose-lg": "0.75rem",
				"prose-xl": "1rem",
				"prose-full": "9999px",
			},
			transitionDuration: {
				"prose-fast": "150ms",
				"prose-normal": "250ms",
				"prose-slow": "350ms",
			},
		},
	},
} as const;

export const cssVariables = {
	// Light Mode (Default)
	light: {
		"--prose-text-primary": "rgb(17 24 39)",
		"--prose-text-secondary": "rgb(75 85 99)",
		"--prose-text-tertiary": "rgb(107 114 128)",
		"--prose-bg-primary": "rgb(255 255 255)",
		"--prose-bg-secondary": "rgb(249 250 251)",
		"--prose-border-default": "rgb(229 231 235)",
		"--prose-border-light": "rgb(243 244 246)",
		"--prose-code-bg": "rgb(243 244 246)",
		"--prose-code-text": "rgb(17 24 39)",
		"--prose-code-border": "rgb(229 231 235)",
		"--prose-link-default": "rgb(59 130 246)",
		"--prose-link-hover": "rgb(37 99 235)",
		"--prose-link-visited": "rgb(147 51 234)",
		"--prose-font-sans": "ui-sans-serif, system-ui, sans-serif",
		"--prose-font-serif": "ui-serif, Georgia, Cambria, serif",
		"--prose-font-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
		"--prose-h1-size": "2.25rem",
		"--prose-h2-size": "1.875rem",
		"--prose-h3-size": "1.5rem",
		"--prose-h4-size": "1.25rem",
		"--prose-h5-size": "1.125rem",
		"--prose-h6-size": "1rem",
		"--prose-body-size": "1rem",
		"--prose-small-size": "0.875rem",
		"--prose-code-size": "0.875rem",
		"--prose-line-tight": "1.25",
		"--prose-line-normal": "1.5",
		"--prose-line-relaxed": "1.75",
		"--prose-weight-normal": "400",
		"--prose-weight-medium": "500",
		"--prose-weight-semibold": "600",
		"--prose-weight-bold": "700",
	},

	// Dark Mode
	dark: {
		"--prose-text-primary": "rgb(229 231 235)",
		"--prose-text-secondary": "rgb(156 163 175)",
		"--prose-text-tertiary": "rgb(107 114 128)",
		"--prose-bg-primary": "rgb(17 24 39)",
		"--prose-bg-secondary": "rgb(31 41 55)",
		"--prose-border-default": "rgb(55 65 81)",
		"--prose-border-light": "rgb(75 85 99)",
		"--prose-code-bg": "rgb(31 41 55)",
		"--prose-code-text": "rgb(229 231 235)",
		"--prose-code-border": "rgb(55 65 81)",
		"--prose-link-default": "rgb(96 165 250)",
		"--prose-link-hover": "rgb(129 140 248)",
		"--prose-link-visited": "rgb(192 132 252)",
	},
} as const;

export type UnoTheme = typeof unoTheme;
export type CssVariables = typeof cssVariables;
