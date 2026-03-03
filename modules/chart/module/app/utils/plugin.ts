import type { ChartData, ChartSeries } from '@/module/app/types/chart-basic';

export interface ChartPlugin {
	name: string;
	version: string;
	description?: string;

	// Custom chart generator
	generateChart?: (data: any, options?: any) => ChartData;

	// Custom component factory
	createComponent?: () => any;

	// Custom utilities
	utils?: Record<string, any>;
}

export interface PluginManager {
	register(plugin: ChartPlugin): void;
	unregister(name: string): void;
	getPlugin(name: string): ChartPlugin | undefined;
	getAllPlugins(): ChartPlugin[];
	generateChart(type: string, data: any, options?: any): ChartData | null;
}

/**
 * Global plugin registry
 */
class ChartPluginManager implements PluginManager {
	private plugins = new Map<string, ChartPlugin>();

	register(plugin: ChartPlugin): void {
		if (this.plugins.has(plugin.name)) {
			throw new Error(`Plugin ${plugin.name} is already registered`);
		}
		this.plugins.set(plugin.name, plugin);
		console.log(`Plugin ${plugin.name} v${plugin.version} registered`);
	}

	unregister(name: string): void {
		if (this.plugins.delete(name)) {
			console.log(`Plugin ${name} unregistered`);
		}
	}

	getPlugin(name: string): ChartPlugin | undefined {
		return this.plugins.get(name);
	}

	getAllPlugins(): ChartPlugin[] {
		return Array.from(this.plugins.values());
	}

	generateChart(type: string, data: any, options?: any): ChartData | null {
		const plugin = this.plugins.get(type);
		if (plugin && plugin.generateChart) {
			try {
				return plugin.generateChart(data, options);
			} catch (error) {
				console.error(`Error generating chart with plugin ${type}:`, error);
				return null;
			}
		}
		return null;
	}
}

// Global instance
export const pluginManager = new ChartPluginManager();

/**
 * Plugin for custom chart types
 */
export function createCustomChartPlugin(
	name: string,
	version: string,
	generateChart: (data: any, options?: any) => ChartData,
	description?: string,
): ChartPlugin {
	return {
		name,
		version,
		description,
		generateChart,
	};
}

/**
 * Plugin for extending existing charts
 */
export function createChartExtensionPlugin(
	name: string,
	version: string,
	extensions: {
		extendChart?: (chartData: ChartData, options?: any) => ChartData;
		addSeries?: (series: ChartSeries[], options?: any) => ChartSeries[];
	},
	description?: string,
): ChartPlugin {
	return {
		name,
		version,
		description,
		generateChart: (data: any, options?: any) => {
			if (extensions.extendChart) {
				return extensions.extendChart(data, options);
			}
			if (extensions.addSeries && Array.isArray(data.series)) {
				return {
					...data,
					series: extensions.addSeries(data.series, options),
				};
			}
			return data;
		},
	};
}

/**
 * Utility to load plugins from external sources
 */
export async function loadPluginFromUrl(url: string): Promise<ChartPlugin> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load plugin from ${url}`);
	}
	const pluginModule = await response.json();
	return pluginModule.default || pluginModule;
}

/**
 * Example plugin: Funnel chart
 */
export const funnelChartPlugin: ChartPlugin = createCustomChartPlugin(
	"funnel",
	"1.0.0",
	(data: Array<{ label: string; value: number }>, options?: any) => {
		return {
			title: options?.title || "Funnel Chart",
			series: [
				{
					name: "Funnel",
					data: data.map((item) => ({
						x: item.label,
						y: item.value,
					})),
					type: "funnel",
				},
			],
		};
	},
	"Plugin for creating funnel charts",
);

/**
 * Example plugin: Gauge chart
 */
export const gaugeChartPlugin: ChartPlugin = createCustomChartPlugin(
	"gauge",
	"1.0.0",
	(value: number, options?: { min?: number; max?: number; title?: string }) => {
		const { min = 0, max = 100, title = "Gauge" } = options || {};
		return {
			title,
			series: [
				{
					name: "Gauge",
					data: [{ x: "Value", y: value }],
					type: "gauge",
					min,
					max,
				},
			],
		};
	},
	"Plugin for creating gauge charts",
);
