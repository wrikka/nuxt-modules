import { type BundledTheme, createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function setupHighlighter(theme: BundledTheme = "vitesse-dark") {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: [theme],
			langs: [
				"typescript",
				"javascript",
				"vue",
				"css",
				"html",
				"scss",
				"json",
				"markdown",
				"bash",
				"sh",
				"python",
				"rust",
				"go",
				"java",
				"c",
				"cpp",
				"csharp",
				"php",
				"ruby",
				"sql",
				"yaml",
				"toml",
				"xml",
			],
		});
	}
	return highlighter;
}

export async function highlightCode(
	code: string,
	lang: any = "text",
	theme: BundledTheme = "vitesse-dark",
) {
	const hl = await setupHighlighter(theme);
	return hl.codeToHtml(code, {
		lang,
		theme,
	});
}
