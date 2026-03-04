import { defineNuxtModule, addImportsDir, createResolver, addComponentsDir, addPlugin } from "@nuxt/kit";

export default defineNuxtModule({
	meta: {
		name: "@wrikka/wrecorder",
		configKey: "wrecorder",
		version: "0.0.2",
		compatibility: {
			nuxt: "^4.0.0",
		},
	},
	defaults: {
		autoImport: true,
	},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);

		// Add composables directory for auto-import
		addImportsDir(resolver.resolve("./app/composables"));

		// Add components directory
		addComponentsDir({
			path: resolver.resolve("./app/components"),
			pathPrefix: false,
		});

		// Add types
		nuxt.hook("prepare:types", ({ references }) => {
			references.push({
				types: "@wrikka/wrecorder",
			});
		});
	},
});
