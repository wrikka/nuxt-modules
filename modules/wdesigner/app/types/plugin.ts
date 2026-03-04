// Plugin System Types

export interface PluginManifest {
	id: string;
	name: string;
	version: string;
	apiVersion: string;
	description?: string;
	author?: string;
	license?: string;
	homepage?: string;
	icon?: string;
	tags?: string[];
	dependencies?: string[];
}

export interface PluginContext {
	canvas: fabric.Canvas | null;
	registry: PluginRegistry;
	hooks: Map<PluginHook, Set<(context: PluginContext) => void | Promise<void>>>;
	emit: (hook: PluginHook, data?: unknown) => Promise<void>;
	hookData?: unknown;
	utils: {
		showToast: (message: string, type?: "info" | "success" | "warning" | "error") => void;
		showModal: (component: string, props?: Record<string, unknown>) => void;
		registerCommand: (id: string, command: PluginCommand) => void;
		addMenuItem: (menuId: string, item: MenuItem) => void;
	};
}

export interface Plugin {
	manifest: PluginManifest;
	source: string;
	isActive: boolean;
	instance: unknown;
	config: Record<string, unknown>;
	activate: () => Promise<void>;
	deactivate: () => Promise<void>;
	updateConfig: (config: Record<string, unknown>) => void;
}

export interface PluginModule {
	manifest: PluginManifest;
	activate?: (context: PluginContext) => Promise<unknown> | unknown;
	deactivate?: (instance: unknown) => Promise<void> | void;
	hooks?: Partial<Record<PluginHook, (context: PluginContext) => void | Promise<void>>>;
	onConfigChange?: (config: Record<string, unknown>) => void;
}

export interface PluginRegistryEntry {
	manifest: PluginManifest;
	loader: () => Promise<unknown>;
}

export type PluginRegistry = Map<string, PluginRegistryEntry>;

export type PluginHook =
	| "canvas:init"
	| "canvas:destroy"
	| "object:create"
	| "object:modify"
	| "object:delete"
	| "layer:change"
	| "export:before"
	| "export:after"
	| "import:before"
	| "import:after"
	| "toolbar:register"
	| "panel:register"
	| "plugin:activate"
	| "plugin:deactivate";

export interface PluginCommand {
	name: string;
	icon?: string;
	shortcut?: string;
	execute: () => void | Promise<void>;
	enabled?: () => boolean;
	visible?: () => boolean;
}

export interface MenuItem {
	id: string;
	label: string;
	icon?: string;
	shortcut?: string;
	action: () => void;
	children?: MenuItem[];
	separator?: boolean;
	disabled?: boolean;
}

// Toolbar Registration
export interface ToolbarRegistration {
	id: string;
	icon: string;
	tooltip: string;
	action: () => void;
	group?: string;
	order?: number;
}

// Panel Registration
export interface PanelRegistration {
	id: string;
	name: string;
	icon: string;
	component: string;
	position: "left" | "right" | "bottom";
	defaultOpen?: boolean;
	order?: number;
}

// Collaboration Types (re-export for convenience)
export type {
	CollaborationUser,
	CollaborationState,
	CRDTOperation,
	WebRTCMessage,
} from "../composables/useDesignerCollaboration";
