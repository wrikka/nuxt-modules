/**
 * Nuxt Plugin to inject Design Tokens CSS Variables
 * Supports light and dark modes
 */

// @ts-ignore
import { defineNuxtPlugin } from "#app";
import { cssVariables } from "../../../shared/tokens/uno-theme";

export default defineNuxtPlugin(() => {
	// Inject CSS variables for design tokens
	const style = document.createElement("style");
	style.setAttribute("data-prose-tokens", "true");

	// Light mode variables
	let css = ":root {\n";
	for (const [key, value] of Object.entries(cssVariables.light)) {
		css += `  ${key}: ${value};\n`;
	}
	css += "}\n";

	// Dark mode variables
	css += ".dark {\n";
	for (const [key, value] of Object.entries(cssVariables.dark)) {
		css += `  ${key}: ${value};\n`;
	}
	css += "}\n";

	style.textContent = css;
	document.head.appendChild(style);
});
