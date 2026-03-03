import {
	defineNuxtModule,
	addImports,
	addComponent,
	createResolver,
} from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";
import { chartFunctions, chartComponents } from './config/module-config';

export interface ModuleOptions {
	// Add module options here if needed
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@wpackages/chart",
		configKey: "chart",
		version: "0.1.0",
	},
	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url);

		// Auto-import chart functions
		chartFunctions.forEach((funcName) => {
			addImports({
				name: funcName,
				from: resolve("./index"),
			});
		});

		// Add chart components
		chartComponents.forEach((componentName) => {
			addComponent({
				name: componentName,
				filePath: resolve(`./components/${componentName}`),
			});
		});

		// Add types to global types
		nuxt.options.typescript.hoist.push("declare global {");
		nuxt.options.typescript.hoist.push("  // @wpackages/chart types");
		nuxt.options.typescript.hoist.push("}");

		// You can add runtime plugin if needed
		// addPlugin(resolve('./runtime/plugin'))

		// You can add composables if needed
		// addImportsDir(resolve('./runtime/composables'))
	},
});
