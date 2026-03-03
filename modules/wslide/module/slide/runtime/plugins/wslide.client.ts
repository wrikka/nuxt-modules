import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
	// Register global WSlide styles
	const style = document.createElement("style");
	style.textContent = `
		:root {
			--wslide-bg: #1a1a1a;
			--wslide-text: #ffffff;
			--wslide-primary: #3b82f6;
			--wslide-secondary: #8b5cf6;
			--wslide-accent: #f59e0b;
			--wslide-font-heading: 'Inter', system-ui, sans-serif;
			--wslide-font-body: 'Inter', system-ui, sans-serif;
			--wslide-font-code: 'JetBrains Mono', monospace;
		}

		.wslide-deck {
			font-family: var(--wslide-font-body);
		}

		.wslide-deck h1,
		.wslide-deck h2,
		.wslide-deck h3,
		.wslide-deck h4,
		.wslide-deck h5,
		.wslide-deck h6 {
			font-family: var(--wslide-font-heading);
			font-weight: 700;
		}

		.wslide-deck code,
		.wslide-deck pre {
			font-family: var(--wslide-font-code);
		}
	`;
	document.head.appendChild(style);

	return {
		provide: {
			wslide: {
				version: "0.0.1",
			},
		},
	};
});
