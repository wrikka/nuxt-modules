import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface PluginManifest {
	id: string;
	name: string;
	version: string;
	description: string;
	author: string;
	entry: string; // URL or path to plugin entry point
	permissions: PluginPermission[];
	hooks: PluginHook[];
	settings?: PluginSetting[];
}

export type PluginPermission =
	| "canvas:read"
	| "canvas:write"
	| "timeline:read"
	| "timeline:write"
	| "storage:read"
	| "storage:write"
	| "network:fetch"
	| "ui:panel"
	| "ui:toolbar"
	| "export:hook";

export interface PluginHook {
	name: string;
	trigger: "before_render" | "after_render" | "before_export" | "after_export" | "on_clip_add" | "on_clip_remove";
}

export interface PluginSetting {
	key: string;
	label: string;
	type: "string" | "number" | "boolean" | "select" | "color";
	default: unknown;
	options?: { label: string; value: string }[];
}

export interface InstalledPlugin {
	manifest: PluginManifest;
	enabled: boolean;
	settings: Record<string, unknown>;
	instance?: unknown;
	installedAt: Date;
}

export interface PluginAPI {
	registerPanel: (id: string, component: unknown) => void;
	registerToolbarButton: (id: string, config: unknown) => void;
	registerEffect: (id: string, config: unknown) => void;
	registerExportFormat: (id: string, config: unknown) => void;
	getCanvas: () => HTMLCanvasElement | null;
	getActiveClip: () => unknown;
	getProject: () => unknown;
	setSetting: (key: string, value: unknown) => void;
	getSetting: (key: string) => unknown;
}

export const usePluginStore = defineStore("plugin", () => {
	const installedPlugins = ref<InstalledPlugin[]>([]);
	const activeHooks = ref<Map<string, Function[]>>(new Map());
	const pluginPanels = ref<Map<string, unknown>>(new Map());
	const pluginToolbarButtons = ref<Map<string, unknown>>(new Map());

	const enabledPlugins = computed(() => installedPlugins.value.filter(p => p.enabled));

	const _availableHooks = [
		"before_render",
		"after_render",
		"before_export",
		"after_export",
		"on_clip_add",
		"on_clip_remove",
		"on_clip_update",
		"on_track_add",
		"on_track_remove",
	] as const;

	const installPlugin = async (manifestUrl: string) => {
		try {
			const response = await fetch(manifestUrl);
			const manifest: PluginManifest = await response.json();

			// Validate manifest
			if (!manifest.id || !manifest.name || !manifest.version) {
				throw new Error("Invalid plugin manifest");
			}

			// Check if already installed
			const existingIndex = installedPlugins.value.findIndex(p => p.manifest.id === manifest.id);
			if (existingIndex >= 0) {
				throw new Error(`Plugin ${manifest.id} is already installed`);
			}

			const plugin: InstalledPlugin = {
				manifest,
				enabled: false,
				settings: {},
				installedAt: new Date(),
			};

			// Initialize default settings
			if (manifest.settings) {
				for (const setting of manifest.settings) {
					plugin.settings[setting.key] = setting.default;
				}
			}

			installedPlugins.value.push(plugin);
			return plugin;
		} catch (error) {
			console.error("Failed to install plugin:", error);
			throw error;
		}
	};

	const uninstallPlugin = (pluginId: string) => {
		const index = installedPlugins.value.findIndex(p => p.manifest.id === pluginId);
		if (index >= 0) {
			// Disable first to cleanup
			disablePlugin(pluginId);
			installedPlugins.value.splice(index, 1);
		}
	};

	const enablePlugin = async (pluginId: string) => {
		const plugin = installedPlugins.value.find(p => p.manifest.id === pluginId);
		if (!plugin || plugin.enabled) return;

		try {
			// Load plugin script
			if (plugin.manifest.entry) {
				await import(/* @vite-ignore */ plugin.manifest.entry);
			}

			// Register hooks
			for (const hook of plugin.manifest.hooks) {
				if (!activeHooks.value.has(hook.trigger)) {
					activeHooks.value.set(hook.trigger, []);
				}
				activeHooks.value.get(hook.trigger)?.push(() => {
					console.log(`Executing hook: ${hook.name}`);
				});
			}

			plugin.enabled = true;
		} catch (error) {
			console.error(`Failed to enable plugin ${pluginId}:`, error);
			throw error;
		}
	};

	const disablePlugin = (pluginId: string) => {
		const plugin = installedPlugins.value.find(p => p.manifest.id === pluginId);
		if (!plugin || !plugin.enabled) return;

		// Unregister hooks
		for (const hook of plugin.manifest.hooks) {
			const hooks = activeHooks.value.get(hook.trigger);
			if (hooks) {
				const index = hooks.findIndex(h => h.name === hook.name);
				if (index >= 0) {
					hooks.splice(index, 1);
				}
			}
		}

		// Remove panels and toolbar buttons
		pluginPanels.value.delete(pluginId);
		pluginToolbarButtons.value.delete(pluginId);

		plugin.enabled = false;
		plugin.instance = undefined;
	};

	const updatePluginSettings = (pluginId: string, settings: Record<string, unknown>) => {
		const plugin = installedPlugins.value.find(p => p.manifest.id === pluginId);
		if (plugin) {
			Object.assign(plugin.settings, settings);
		}
	};

	const executeHook = async (hookName: string, context: unknown) => {
		const hooks = activeHooks.value.get(hookName);
		if (!hooks) return context;

		let result = context;
		for (const hook of hooks) {
			try {
				result = await hook(result) ?? result;
			} catch (error) {
				console.error(`Hook execution failed:`, error);
			}
		}
		return result;
	};

	const registerPluginPanel = (pluginId: string, component: unknown) => {
		pluginPanels.value.set(pluginId, component);
	};

	const registerPluginToolbarButton = (pluginId: string, config: unknown) => {
		pluginToolbarButtons.value.set(pluginId, config);
	};

	const getPluginAPI = (pluginId: string): PluginAPI => {
		const plugin = installedPlugins.value.find(p => p.manifest.id === pluginId);
		if (!plugin) {
			throw new Error(`Plugin ${pluginId} not found`);
		}

		return {
			registerPanel: (id, component) => registerPluginPanel(`${pluginId}.${id}`, component),
			registerToolbarButton: (id, config) => registerPluginToolbarButton(`${pluginId}.${id}`, config),
			registerEffect: () => {
				console.log("Register effect not yet implemented");
			},
			registerExportFormat: () => {
				console.log("Register export format not yet implemented");
			},
			getCanvas: () => null,
			getActiveClip: () => null,
			getProject: () => null,
			setSetting: (key, value) => {
				const newSettings = { ...plugin.settings, [key]: value };
				updatePluginSettings(pluginId, newSettings);
			},
			getSetting: (key) => plugin.settings[key],
		};
	};

	const getPluginsByPermission = (permission: PluginPermission) => {
		return enabledPlugins.value.filter(p => p.manifest.permissions.includes(permission));
	};

	const hasPermission = (pluginId: string, permission: PluginPermission): boolean => {
		const plugin = installedPlugins.value.find(p => p.manifest.id === pluginId);
		return plugin?.manifest.permissions.includes(permission) ?? false;
	};

	return {
		installedPlugins,
		enabledPlugins,
		activeHooks,
		pluginPanels,
		pluginToolbarButtons,
		installPlugin,
		uninstallPlugin,
		enablePlugin,
		disablePlugin,
		updatePluginSettings,
		executeHook,
		registerPluginPanel,
		registerPluginToolbarButton,
		getPluginAPI,
		getPluginsByPermission,
		hasPermission,
	};
});
