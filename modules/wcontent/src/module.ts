import { addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";
import { defu } from "defu";

export const defineCollection = (config: any) => config;
export const defineContentConfig = (config: any) => config;

export default defineNuxtModule({
	meta: {
		name: "@wrikka/content",
		configKey: "content",
		compatibility: {
			nuxt: "^4.0.0",
		},
	},
	defaults: {
		contentDirs: ["content"],
		watch: true,
		highlight: true,
		markdown: {
			breaks: true,
			linkify: true,
			typographer: true,
		},
	},
	setup(_options: any, nuxt: any) {
		const resolver = createResolver(import.meta.url);
		const logger = useLogger("@wrikka/content");

		// Merge user options with defaults
		const config = defu(nuxt.options.runtimeConfig.public.content, options);

		// Add runtime config
		nuxt.options.runtimeConfig.public.content = config;

		// Register runtime directory
		nuxt.options.alias["#content"] = resolver.resolve("./runtime");

		// Register types
		nuxt.options.alias["#content/types"] = resolver.resolve("./runtime/shared/types/index");

		// Register composables
		addImportsDir(resolver.resolve("./runtime/app/composables"));

		// Register components
		addComponentsDir({
			path: resolver.resolve("./runtime/app/components"),
			prefix: "Content",
		});

		// Register plugins
		addPlugin(resolver.resolve("./runtime/plugins/content.client"));
		addPlugin(resolver.resolve("./runtime/plugins/content.server"));

		// Add types
		nuxt.hook("prepare:types", ({ references }) => {
			references.push({
				types: resolver.resolve("./types"),
			});
		});

		logger.success("Content module loaded");
	},
}) as NuxtModule<any, any>;
