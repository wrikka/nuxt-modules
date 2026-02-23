import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir } from "@nuxt/kit";
import { defu } from "defu";

export interface ModuleOptions {
	/**
	 * Enable or disable the module
	 * @default true
	 */
	enabled: boolean;
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@wrikka/wdesign",
		configKey: "wdesign",
		compatibility: {
			nuxt: "^3.0.0",
		},
	},
	defaults: {
		enabled: true,
	},
	setup(options, nuxt) {
		if (!options.enabled) return;

		const resolver = createResolver(import.meta.url);

		// Add components
		addComponentsDir({
			path: resolver.resolve("./runtime/components/ui"),
			prefix: "",
		});

		// Add composables/utilities
		addImportsDir(resolver.resolve("./lib"));

		// Add UnoCSS config if available
		const unoConfigPath = resolver.resolve("../uno.config");
		if (nuxt.options.unocss?.configPath) {
			// Merge with existing UnoCSS config
			nuxt.options.unocss.configPath = defu(
				nuxt.options.unocss.configPath,
				unoConfigPath
			);
		} else {
			// Set as default
			nuxt.options.unocss = defu(nuxt.options.unocss, {
				configPath: unoConfigPath,
			});
		}
	},
});
