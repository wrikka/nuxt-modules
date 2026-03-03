import {
	addComponentsDir,
	addImportsDir,
	addPlugin,
	createResolver,
	defineNuxtModule,
	useLogger,
} from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";
import { defu } from "defu";

export interface WSlideModuleOptions {
	srcDir: string;
	theme: string;
	transition: string;
	presenterMode: boolean;
	exportEnabled: boolean;
	laserPointer: boolean;
	drawing: boolean;
	timer: boolean;
	spotlight: boolean;
	overview: boolean;
	autoplay: boolean;
	qrcode: boolean;
	camera: boolean;
	polls: boolean;
	recording: boolean;
	fragments: boolean;
	shortcuts: boolean;
	zoom: boolean;
	print: boolean;
	mermaid: boolean;
	math: boolean;
	codeHighlight: boolean;
	darkMode: boolean;
	transitionPresets: boolean;
	templates: boolean;
	notesFontSize: boolean;
	transitionPreview: boolean;
	importPPT: boolean;
	collaborative: boolean;
	iframe: boolean;
	exportPDF: boolean;
	animations: {
		enabled: boolean;
		duration: number;
		easing: string;
	};
	controls: {
		slideNumbers: boolean;
		progressBar: boolean;
		navigation: boolean;
		presenterNotes: boolean;
	};
}

export default defineNuxtModule({
	meta: {
		name: "@wrikka/wslide",
		configKey: "wslide",
		compatibility: {
			nuxt: "^4.0.0",
		},
	},
	defaults: {
		srcDir: "slides",
		theme: "default",
		transition: "slide",
		presenterMode: true,
		exportEnabled: true,
		// Feature toggles
		laserPointer: true,
		drawing: true,
		timer: true,
		spotlight: true,
		overview: true,
		autoplay: true,
		qrcode: true,
		camera: true,
		polls: true,
		recording: true,
		fragments: true,
		shortcuts: true,
		zoom: true,
		print: true,
		mermaid: true,
		math: true,
		codeHighlight: true,
		darkMode: true,
		transitionPresets: true,
		templates: true,
		notesFontSize: true,
		transitionPreview: true,
		importPPT: true,
		collaborative: true,
		iframe: true,
		exportPDF: true,
		animations: {
			enabled: true,
			duration: 500,
			easing: "ease-out",
		},
		controls: {
			slideNumbers: true,
			progressBar: true,
			navigation: true,
			presenterNotes: true,
		},
	} as WSlideModuleOptions,
	setup(options: WSlideModuleOptions, nuxt) {
		const resolver = createResolver(import.meta.url);
		const logger = useLogger("@wrikka/wslide");

		// Merge user options with defaults
		const config = defu(
			(nuxt.options.runtimeConfig.public.wslide as WSlideModuleOptions) || {},
			options,
		);

		// Add runtime config
		nuxt.options.runtimeConfig.public.wslide = config;

		// Register runtime directory
		nuxt.options.alias["#wslide"] = resolver.resolve("./runtime");
		nuxt.options.alias["#wslide/features"] =
			resolver.resolve("./runtime/features");
		nuxt.options.alias["#wslide/stores"] = resolver.resolve("./runtime/stores");

		// Register composables
		addImportsDir(resolver.resolve("./runtime/composables"));
		addImportsDir(resolver.resolve("./runtime/features"));

		// Register components
		addComponentsDir({
			path: resolver.resolve("./runtime/components"),
			prefix: "WSlide",
		});

		// Register feature components
		addComponentsDir({
			path: resolver.resolve("./runtime/features"),
			prefix: "WSlide",
			global: true,
		});

		// Register plugins
		addPlugin(resolver.resolve("./runtime/plugins/wslide.client"));

		// Register feature plugins conditionally
		if (config.mermaid) {
			addPlugin(resolver.resolve("./runtime/plugins/mermaid.client"));
		}
		if (config.math) {
			addPlugin(resolver.resolve("./runtime/plugins/math.client"));
		}
		if (config.codeHighlight) {
			addPlugin(resolver.resolve("./runtime/plugins/highlight.client"));
		}

		// Add types
		nuxt.hook("prepare:types", ({ references }) => {
			references.push({
				types: resolver.resolve("./types"),
			});
			references.push({
				types: resolver.resolve("./runtime/types"),
			});
		});

		logger.success(
			`WSlide module loaded with ${Object.entries(config).filter(([_k, v]) => typeof v === "boolean" && v).length} features enabled`,
		);
	},
}) as NuxtModule<WSlideModuleOptions, WSlideModuleOptions>;
