import type { Plugin, PluginContext, PluginHook, PluginManifest, PluginRegistry } from "../types/plugin";
import { computed, ref, shallowRef } from "vue";

const PLUGIN_STORAGE_KEY = "wdesigner:plugins";

export interface UseDesignerPluginsOptions {
	onPluginLoad?: (plugin: Plugin) => void;
	onPluginUnload?: (plugin: Plugin) => void;
	getCanvas: () => fabric.Canvas | null;
}

export const useDesignerPlugins = (options: UseDesignerPluginsOptions) => {
	// State
	const plugins = shallowRef<Plugin[]>([]);
	const registry = shallowRef<PluginRegistry>(new Map());
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	// Hooks storage
	const hooks = shallowRef<Map<PluginHook, Set<(context: PluginContext) => void | Promise<void>>>(new Map());

	// Built-in plugins cache
	const builtInPlugins = shallowRef<Map<string, PluginManifest>>(new Map());

	// Computed
	const activePlugins = computed(() => plugins.value.filter((p) => p.isActive));
	const pluginCount = computed(() => plugins.value.length);
	const activePluginCount = computed(() => activePlugins.value.length);

	// Initialize hooks map
	const initializeHooks = () => {
		const hookTypes: PluginHook[] = [
			"canvas:init",
			"canvas:destroy",
			"object:create",
			"object:modify",
			"object:delete",
			"layer:change",
			"export:before",
			"export:after",
			"import:before",
			"import:after",
			"toolbar:register",
			"panel:register",
		];

		for (const hook of hookTypes) {
			hooks.value.set(hook, new Set());
		}
	};

	initializeHooks();

	// Helper functions
	const createPluginContext = (): PluginContext => {
		return {
			canvas: options.getCanvas(),
			registry: registry.value,
			hooks: hooks.value,
			emit: async (hook, data) => {
				await executeHook(hook, data);
			},
			utils: {
				showToast: (message, type = "info") => {
					console.log(`[Plugin] ${type}: ${message}`);
					// Could integrate with actual toast system
				},
				showModal: (component, props) => {
					console.log("[Plugin] Show modal:", component, props);
				},
				registerCommand: (id, command) => {
					console.log("[Plugin] Register command:", id, command);
				},
				addMenuItem: (menuId, item) => {
					console.log("[Plugin] Add menu item:", menuId, item);
				},
			},
		};
	};

	const executeHook = async (hook: PluginHook, data?: unknown): Promise<void> => {
		const hookHandlers = hooks.value.get(hook);
		if (!hookHandlers) return;

		const context = createPluginContext();
		(context as Record<string, unknown>).hookData = data;

		for (const handler of hookHandlers) {
			try {
				await handler(context);
			} catch (err) {
				console.error(`[Plugin] Hook "${hook}" failed:`, err);
			}
		}
	};

	const validatePluginManifest = (manifest: unknown): manifest is PluginManifest => {
		if (typeof manifest !== "object" || manifest === null) return false;

		const m = manifest as Record<string, unknown>;
		return (
			typeof m.id === "string" &&
			m.id.length > 0 &&
			typeof m.name === "string" &&
			m.name.length > 0 &&
			typeof m.version === "string" &&
			typeof m.apiVersion === "string"
		);
	};

	const loadPluginFromUrl = async (url: string): Promise<Plugin | null> => {
		try {
			// Fetch and load plugin code
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch plugin: ${response.statusText}`);
			}

			const code = await response.text();
			return loadPluginFromCode(code, url);
		} catch (err) {
			console.error("[Plugin] Failed to load from URL:", err);
			return null;
		}
	};

	const loadPluginFromCode = (code: string, source: string): Plugin | null => {
		try {
			// Create a sandboxed function to execute plugin code
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const pluginFactory = new Function(
				"context",
				`"use strict";
				const exports = {};
				const module = { exports };
				${code}
				return module.exports;`,
			);

			// Get manifest from the factory
			const tempContext = createPluginContext();
			const pluginModule = pluginFactory(tempContext);

			if (!pluginModule || typeof pluginModule !== "object") {
				throw new Error("Plugin must export an object");
			}

			if (!validatePluginManifest(pluginModule.manifest)) {
				throw new Error("Invalid plugin manifest");
			}

			const manifest = pluginModule.manifest;

			// Check for duplicate
			if (plugins.value.some((p) => p.manifest.id === manifest.id)) {
				throw new Error(`Plugin "${manifest.id}" is already loaded`);
			}

			const plugin: Plugin = {
				manifest,
				source,
				isActive: false,
				instance: null,
				config: {},
				activate: async () => {
					if (plugin.isActive) return;

					const context = createPluginContext();
					if (pluginModule.activate) {
						plugin.instance = await pluginModule.activate(context);
					}
					plugin.isActive = true;

					// Register hooks
					if (pluginModule.hooks) {
						for (const [hook, handler] of Object.entries(pluginModule.hooks)) {
							if (typeof handler === "function") {
								hooks.value.get(hook as PluginHook)?.add(handler);
							}
						}
					}

					options.onPluginLoad?.(plugin);
					await executeHook("plugin:activate", { plugin });
				},
				deactivate: async () => {
					if (!plugin.isActive) return;

					// Unregister hooks
					if (pluginModule.hooks) {
						for (const [hook, handler] of Object.entries(pluginModule.hooks)) {
							if (typeof handler === "function") {
								hooks.value.get(hook as PluginHook)?.delete(handler);
							}
						}
					}

					if (pluginModule.deactivate && plugin.instance) {
						await pluginModule.deactivate(plugin.instance);
					}

					plugin.isActive = false;
					plugin.instance = null;

					options.onPluginUnload?.(plugin);
					await executeHook("plugin:deactivate", { plugin });
				},
				updateConfig: (newConfig: Record<string, unknown>) => {
					plugin.config = { ...plugin.config, ...newConfig };
					if (pluginModule.onConfigChange) {
						pluginModule.onConfigChange(plugin.config);
					}
				},
			};

			return plugin;
		} catch (err) {
			console.error("[Plugin] Failed to load plugin:", err);
			error.value = err instanceof Error ? err.message : "Unknown error";
			return null;
		}
	};

	// Public methods
	const registerBuiltInPlugin = (manifest: PluginManifest, loader: () => Promise<unknown>) => {
		builtInPlugins.value.set(manifest.id, manifest);
		registry.value.set(manifest.id, { manifest, loader });
	};

	const loadBuiltInPlugin = async (id: string): Promise<Plugin | null> => {
		const entry = registry.value.get(id);
		if (!entry) {
			error.value = `Built-in plugin "${id}" not found`;
			return null;
		}

		try {
			const module = await entry.loader();
			if (typeof module === "function") {
				const context = createPluginContext();
				const result = await module(context);

				// Create a plugin from the result
				const code = `
					exports.manifest = ${JSON.stringify(entry.manifest)};
					exports.activate = ${result.activate?.toString() || "undefined"};
					exports.deactivate = ${result.deactivate?.toString() || "undefined"};
					exports.hooks = ${JSON.stringify(result.hooks || {})};
				`;
				return loadPluginFromCode(code, `builtin:${id}`);
			}
		} catch (err) {
			console.error(`[Plugin] Failed to load built-in "${id}":`, err);
			error.value = err instanceof Error ? err.message : "Unknown error";
		}

		return null;
	};

	const installPlugin = async (source: string): Promise<Plugin | null> => {
		isLoading.value = true;
		error.value = null;

		try {
			let plugin: Plugin | null;

			if (source.startsWith("http://") || source.startsWith("https://") || source.startsWith("/")) {
				// Load from URL
				plugin = await loadPluginFromUrl(source);
			} else if (source.startsWith("builtin:")) {
				// Load built-in
				const id = source.replace("builtin:", "");
				plugin = await loadBuiltInPlugin(id);
			} else {
				// Load from code
				plugin = loadPluginFromCode(source, "inline");
			}

			if (plugin) {
				plugins.value = [...plugins.value, plugin];
				savePlugins();
				return plugin;
			}
		} finally {
			isLoading.value = false;
		}

		return null;
	};

	const uninstallPlugin = async (pluginId: string): Promise<boolean> => {
		const plugin = plugins.value.find((p) => p.manifest.id === pluginId);
		if (!plugin) return false;

		// Deactivate first
		if (plugin.isActive) {
			await plugin.deactivate();
		}

		plugins.value = plugins.value.filter((p) => p.manifest.id !== pluginId);
		savePlugins();
		return true;
	};

	const activatePlugin = async (pluginId: string): Promise<boolean> => {
		const plugin = plugins.value.find((p) => p.manifest.id === pluginId);
		if (!plugin) return false;

		await plugin.activate();
		savePlugins();
		return true;
	};

	const deactivatePlugin = async (pluginId: string): Promise<boolean> => {
		const plugin = plugins.value.find((p) => p.manifest.id === pluginId);
		if (!plugin) return false;

		await plugin.deactivate();
		savePlugins();
		return true;
	};

	const updatePluginConfig = (pluginId: string, config: Record<string, unknown>): boolean => {
		const plugin = plugins.value.find((p) => p.manifest.id === pluginId);
		if (!plugin) return false;

		plugin.updateConfig(config);
		savePlugins();
		return true;
	};

	const getPlugin = (pluginId: string): Plugin | undefined => {
		return plugins.value.find((p) => p.manifest.id === pluginId);
	};

	const getAllPlugins = (): Plugin[] => {
		return [...plugins.value];
	};

	const savePlugins = () => {
		// Save plugin list to localStorage
		const pluginData = plugins.value.map((p) => ({
			manifest: p.manifest,
			source: p.source,
			isActive: p.isActive,
			config: p.config,
		}));
		localStorage.setItem(PLUGIN_STORAGE_KEY, JSON.stringify(pluginData));
	};

	const restorePlugins = async (): Promise<void> => {
		const saved = localStorage.getItem(PLUGIN_STORAGE_KEY);
		if (!saved) return;

		try {
			const pluginData = JSON.parse(saved) as Array<{
				manifest: PluginManifest;
				source: string;
				isActive: boolean;
				config: Record<string, unknown>;
			}>;

			for (const data of pluginData) {
				const plugin = await installPlugin(data.source);
				if (plugin && data.isActive) {
					await plugin.activate();
				}
				if (plugin && data.config) {
					plugin.updateConfig(data.config);
				}
			}
		} catch (err) {
			console.error("[Plugin] Failed to restore plugins:", err);
		}
	};

	const createPluginTemplate = (manifest: Omit<PluginManifest, "apiVersion">): string => {
		const fullManifest: PluginManifest = {
			...manifest,
			apiVersion: "1.0.0",
		};

		return `// WDesigner Plugin Template
exports.manifest = ${JSON.stringify(fullManifest, null, 2)};

// Called when plugin is activated
exports.activate = async (context) => {
  console.log("Plugin activated:", context);
  
  // Access canvas
  const canvas = context.canvas;
  
  // Register a command
  context.utils.registerCommand("myCommand", {
    name: "My Command",
    execute: () => {
      console.log("Command executed!");
    }
  });
  
  // Return plugin instance (optional)
  return { 
    version: "${manifest.version}"
  };
};

// Called when plugin is deactivated
exports.deactivate = async (instance) => {
  console.log("Plugin deactivated:", instance);
};

// Hook handlers
exports.hooks = {
  "canvas:init": (context) => {
    console.log("Canvas initialized");
  },
  "object:create": (context) => {
    console.log("Object created:", context.hookData);
  }
};

// Config change handler
exports.onConfigChange = (config) => {
  console.log("Config updated:", config);
};
`;
	};

	const dispose = () => {
		// Deactivate all plugins
		for (const plugin of plugins.value) {
			if (plugin.isActive) {
				plugin.deactivate();
			}
		}
		plugins.value = [];
		hooks.value.clear();
		registry.value.clear();
	};

	return {
		// State
		plugins,
		activePlugins,
		pluginCount,
		activePluginCount,
		isLoading,
		error,
		builtInPlugins,
		registry,

		// Actions
		registerBuiltInPlugin,
		installPlugin,
		uninstallPlugin,
		activatePlugin,
		deactivatePlugin,
		updatePluginConfig,
		getPlugin,
		getAllPlugins,
		savePlugins,
		restorePlugins,
		createPluginTemplate,
		executeHook,
		dispose,
	};
};
