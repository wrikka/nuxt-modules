/**
 * Design Tokens for Prose Components
 * Provides consistent styling across all content elements
 */

export const designTokens = {
	// Colors
	colors: {
		text: {
			primary: "var(--prose-text-primary)",
			secondary: "var(--prose-text-secondary)",
			tertiary: "var(--prose-text-tertiary)",
		},
		background: {
			primary: "var(--prose-bg-primary)",
			secondary: "var(--prose-bg-secondary)",
		},
		border: {
			default: "var(--prose-border-default)",
			light: "var(--prose-border-light)",
		},
		code: {
			background: "var(--prose-code-bg)",
			text: "var(--prose-code-text)",
			border: "var(--prose-code-border)",
		},
		link: {
			default: "var(--prose-link-default)",
			hover: "var(--prose-link-hover)",
			visited: "var(--prose-link-visited)",
		},
	},

	// Typography
	typography: {
		fontFamily: {
			sans: "var(--prose-font-sans)",
			serif: "var(--prose-font-serif)",
			mono: "var(--prose-font-mono)",
		},
		fontSize: {
			h1: "var(--prose-h1-size)",
			h2: "var(--prose-h2-size)",
			h3: "var(--prose-h3-size)",
			h4: "var(--prose-h4-size)",
			h5: "var(--prose-h5-size)",
			h6: "var(--prose-h6-size)",
			body: "var(--prose-body-size)",
			small: "var(--prose-small-size)",
			code: "var(--prose-code-size)",
		},
		fontWeight: {
			normal: "var(--prose-weight-normal)",
			medium: "var(--prose-weight-medium)",
			semibold: "var(--prose-weight-semibold)",
			bold: "var(--prose-weight-bold)",
		},
		lineHeight: {
			tight: "var(--prose-line-tight)",
			normal: "var(--prose-line-normal)",
			relaxed: "var(--prose-line-relaxed)",
		},
		letterSpacing: {
			tight: "-0.025em",
			normal: "0",
			wide: "0.025em",
		},
	},

	// Spacing
	spacing: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
		"2xl": "3rem",
		"3xl": "4rem",
	},

	// Border Radius
	radius: {
		sm: "0.25rem",
		md: "0.5rem",
		lg: "0.75rem",
		xl: "1rem",
		full: "9999px",
	},

	// Shadows
	shadow: {
		sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
		md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
		lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
		xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
	},

	// Transitions
	transition: {
		fast: "150ms ease-in-out",
		normal: "250ms ease-in-out",
		slow: "350ms ease-in-out",
	},

	// Z-index
	zIndex: {
		base: "0",
		raised: "10",
		overlay: "100",
		modal: "1000",
	},
} as const;

export type DesignTokens = typeof designTokens;
