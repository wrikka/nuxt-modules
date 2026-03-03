<script setup lang="ts">
export interface ExportPreset {
	id: string;
	name: string;
	description: string;
	format: "png" | "jpg" | "svg" | "pdf" | "webp";
	quality: number;
	width?: number;
	height?: number;
	scale: number;
	transparent: boolean;
	colorSpace: "srgb" | "p3";
	optimization: "none" | "light" | "aggressive";
}

const presets: ExportPreset[] = [
	{
		id: "web-optimized",
		name: "Web Optimized",
		description: "Optimized for fast web loading",
		format: "webp",
		quality: 85,
		scale: 1,
		transparent: false,
		colorSpace: "srgb",
		optimization: "aggressive",
	},
	{
		id: "social-media",
		name: "Social Media",
		description: "High quality for social posts",
		format: "png",
		quality: 95,
		scale: 2,
		transparent: true,
		colorSpace: "srgb",
		optimization: "light",
	},
	{
		id: "print-ready",
		name: "Print Ready",
		description: "300 DPI for professional printing",
		format: "pdf",
		quality: 100,
		scale: 3.125,
		transparent: false,
		colorSpace: "p3",
		optimization: "none",
	},
	{
		id: "presentation",
		name: "Presentation",
		description: "Compatible with PowerPoint/Keynote",
		format: "png",
		quality: 90,
		scale: 1,
		transparent: false,
		colorSpace: "srgb",
		optimization: "light",
	},
	{
		id: "icon-export",
		name: "App Icon",
		description: "Multiple sizes for app icons",
		format: "png",
		quality: 100,
		scale: 1,
		transparent: true,
		colorSpace: "srgb",
		optimization: "none",
	},
	{
		id: "vector",
		name: "Vector Export",
		description: "Scalable vector format",
		format: "svg",
		quality: 100,
		scale: 1,
		transparent: true,
		colorSpace: "srgb",
		optimization: "none",
	},
];

const props = defineProps<{
	selectedPresetId: string | null;
}>();

const emit = defineEmits<{
	(e: "select", preset: ExportPreset): void;
	(e: "custom"): void;
}>();

const getFormatIcon = (format: string): string => {
	const icons: Record<string, string> = {
		png: "🖼️",
		jpg: "📷",
		webp: "🌐",
		svg: "📐",
		pdf: "📄",
	};
	return icons[format] || "📦";
};
</script>

<template>
	<div class="space-y-3">
		<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
		>Export Presets</label>

		<div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
			<button
				v-for="preset in presets"
				:key="preset.id"
				type="button"
				class="flex items-start gap-3 p-3 rounded-lg border transition-all text-left"
				:class="selectedPresetId === preset.id
				? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-1 ring-blue-200'
				: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
				@click="$emit('select', preset)"
			>
				<div class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
					{{ getFormatIcon(preset.format) }}
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2">
						<span
							class="text-sm font-medium text-gray-700 dark:text-gray-300"
						>{{ preset.name }}</span>
						<span
							class="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 uppercase"
						>{{ preset.format }}</span>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
						{{ preset.description }}
					</p>
					<div class="flex items-center gap-2 mt-1 text-xs text-gray-400">
						<span>Q: {{ preset.quality }}%</span>
						<span>•</span>
						<span>{{ preset.scale }}×</span>
						<span>•</span>
						<span>{{ preset.transparent ? "Transparent" : "Opaque" }}</span>
					</div>
				</div>
			</button>
		</div>

		<button
			type="button"
			class="w-full p-2 rounded border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
			@click="$emit('custom')"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
				/>
			</svg>
			Custom Export Settings
		</button>
	</div>
</template>
