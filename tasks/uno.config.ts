import {
	defineConfig,
	presetIcons,
	presetWind4,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss"

export default defineConfig({
	presets: [
		presetWind4({
			darkMode: "class",
			preflights: {
				reset: true,
			},
		}),
		presetIcons(),
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
		transformerCompileClass(),
	],
	theme: {
		colors: {
			border: "hsl(var(--border))",
			input: "hsl(var(--input))",
			ring: "hsl(var(--ring))",
			background: "hsl(var(--background))",
			foreground: "hsl(var(--foreground))",
			primary: {
				DEFAULT: "hsl(var(--primary))",
				foreground: "hsl(var(--primary-foreground))",
			},
			secondary: {
				DEFAULT: "hsl(var(--secondary))",
				foreground: "hsl(var(--secondary-foreground))",
			},
			destructive: {
				DEFAULT: "hsl(var(--destructive))",
				foreground: "hsl(var(--destructive-foreground))",
			},
			muted: {
				DEFAULT: "hsl(var(--muted))",
				foreground: "hsl(var(--muted-foreground))",
			},
			accent: {
				DEFAULT: "hsl(var(--accent))",
				foreground: "hsl(var(--accent-foreground))",
			},
			popover: {
				DEFAULT: "hsl(var(--popover))",
				foreground: "hsl(var(--popover-foreground))",
			},
			card: {
				DEFAULT: "hsl(var(--card))",
				foreground: "hsl(var(--card-foreground))",
			},
			orange: "hsl(var(--orange))",
			yellow: "hsl(var(--yellow))",
			blue: "hsl(var(--blue))",
		},
	},
})
