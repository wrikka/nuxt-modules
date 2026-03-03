import type { ContentItem } from "../../../shared/types";

export interface Plugin {
	name: string;
	version: string;
	setup?(options?: any): void;
	transform?(item: ContentItem): ContentItem | Promise<ContentItem>;
	validate?(item: ContentItem): boolean | Promise<boolean>;
}

export class ContentPlugins {
	private plugins: Map<string, Plugin> = new Map();

	register(plugin: Plugin): void {
		this.plugins.set(plugin.name, plugin);

		// Initialize plugin if setup method exists
		if (plugin.setup) {
			plugin.setup();
		}
	}

	get(name: string): Plugin | undefined {
		return this.plugins.get(name);
	}

	async transform(item: ContentItem): Promise<ContentItem> {
		let result = item;

		for (const plugin of this.plugins.values()) {
			if (plugin.transform) {
				result = await plugin.transform(result);
			}
		}

		return result;
	}

	async validate(item: ContentItem): Promise<boolean> {
		for (const plugin of this.plugins.values()) {
			if (plugin.validate) {
				const isValid = await plugin.validate(item);
				if (!isValid) {
					return false;
				}
			}
		}

		return true;
	}

	getPlugins(): Plugin[] {
		return Array.from(this.plugins.values());
	}

	getPluginNames(): string[] {
		return Array.from(this.plugins.keys());
	}

	hasPlugin(name: string): boolean {
		return this.plugins.has(name);
	}

	unregister(name: string): void {
		this.plugins.delete(name);
	}

	clear(): void {
		this.plugins.clear();
	}
}

let pluginsInstance: ContentPlugins | null = null;

export function getContentPlugins(): ContentPlugins {
	if (!pluginsInstance) {
		pluginsInstance = new ContentPlugins();
	}
	return pluginsInstance;
}
