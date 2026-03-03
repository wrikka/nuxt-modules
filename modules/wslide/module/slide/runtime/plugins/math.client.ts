import katex from "katex";
import { defineNuxtPlugin } from "nuxt/app";
import "katex/dist/katex.min.css";

export default defineNuxtPlugin(() => {
	// Initialize KaTeX for math rendering
	// KaTeX will be available globally for math expressions in slides

	return {
		provide: {
			katex,
		},
	};
});
