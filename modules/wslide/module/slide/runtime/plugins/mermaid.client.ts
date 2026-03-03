import mermaid from "mermaid";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
	// Initialize Mermaid
	mermaid.initialize({
		startOnLoad: true,
		theme: "default",
		securityLevel: "loose",
		fontFamily: "var(--wslide-font-body)",
	});

	return {
		provide: {
			mermaid,
		},
	};
});
