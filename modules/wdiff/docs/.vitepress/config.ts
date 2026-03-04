import { defineConfig } from "vitepress";

export default defineConfig({
	description: "Nuxt diff utilities module",

	themeConfig: {
		nav: [
			{ link: "/", text: "Home" },
			{ link: "/components/", text: "Components" },
			{ link: "/api/", text: "API" },
		],

		sidebar: {
			"/": [
				{
					items: [
						{ link: "/", text: "Introduction" },
						{ link: "/guide/installation", text: "Installation" },
						{ link: "/guide/usage", text: "Usage" },
					],
					text: "Guide",
				},
				{
					items: [
						{ link: "/components/", text: "Overview" },
						{ link: "/components/diff-summary", text: "DiffSummary" },
						{ link: "/components/file-diff", text: "FileDiff" },
						{ link: "/components/diff-section", text: "DiffSection" },
					],
					text: "Components",
				},
				{
					items: [
						{ link: "/api/", text: "Overview" },
						// Add more API docs here
					],
					text: "API",
				},
			],
		},
	},
	title: "@wpackages/diff",
});
