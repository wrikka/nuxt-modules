import {
	addComponentsDir,
	addImportsDir,
	createResolver,
	defineNuxtModule,
} from "@nuxt/kit";

export default defineNuxtModule({
	defaults: {
		// Default options
	},
	meta: {
		configKey: "diff",
		name: "@wrikka/diff",
	},
	setup(_options, nuxt) {
		const resolver = createResolver(import.meta.url);

		// Add UnoCSS module
		nuxt.options.modules.push("@unocss/nuxt");

		// Add runtime components
		addComponentsDir({
			path: resolver.resolve("./runtime/components"),
			pathPrefix: false,
		});

		// Add runtime composables
		addImportsDir(resolver.resolve("./runtime/composables"));

		// Add runtime utils
		addImportsDir(resolver.resolve("./runtime/utils"));
	},
});
