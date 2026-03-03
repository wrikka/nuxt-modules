import { defineNuxtPlugin } from "nuxt/app";
import { createHighlighter } from "shiki";

export default defineNuxtPlugin(async () => {
	// Initialize Shiki highlighter for code syntax highlighting
	const highlighter = await createHighlighter({
		langs: [
			"javascript",
			"typescript",
			"vue",
			"html",
			"css",
			"json",
			"bash",
			"python",
			"rust",
			"go",
			"java",
			"php",
			"ruby",
			"swift",
			"kotlin",
			"dart",
			"scala",
			"clojure",
			"haskell",
			"elixir",
			"erlang",
		],
		themes: ["github-dark"],
	});

	return {
		provide: {
			highlighter,
		},
	};
});
