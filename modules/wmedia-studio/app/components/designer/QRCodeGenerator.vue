<script setup lang="ts">
export interface QRCodeConfig {
	data: string;
	size: number;
	color: string;
	backgroundColor: string;
	errorCorrection: "L" | "M" | "Q" | "H";
}

const props = defineProps<{
	config: QRCodeConfig;
}>();

const emit = defineEmits<{
	(e: "update:config", value: QRCodeConfig): void;
	(e: "generate"): void;
}>();

const updateConfig = (updates: Partial<QRCodeConfig>) => {
	emit("update:config", { ...props.config, ...updates });
};

const errorLevels = [
	{ value: "L", label: "Low (~7%)" },
	{ value: "M", label: "Medium (~15%)" },
	{ value: "Q", label: "Quartile (~25%)" },
	{ value: "H", label: "High (~30%)" },
] as const;

const sampleData = [
	"https://example.com",
	"https://media-studio.app",
	"WIFI:T:WPA;S:Network;P:password;;",
	"BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD",
	"mailto:contact@example.com",
];
</script>

<template>
	<div class="space-y-3">
		<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
		>QR Code Generator</label>

		<div class="space-y-2">
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Content (URL, Text, etc.)</label>
				<textarea
					:value="config.data"
					rows="3"
					class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
					placeholder="Enter URL, text, or contact info..."
					@input="updateConfig({ data: ($event.target as HTMLTextAreaElement).value })"
				/>
			</div>

			<div class="flex gap-1">
				<button
					v-for="sample in sampleData"
					:key="sample"
					type="button"
					class="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					@click="updateConfig({ data: sample })"
				>
					{{ sample.slice(0, 15) }}...
				</button>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-2">
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Foreground</label>
				<div class="flex items-center gap-2">
					<input
						type="color"
						:value="config.color"
						class="w-8 h-8 rounded cursor-pointer"
						@input="updateConfig({ color: ($event.target as HTMLInputElement).value })"
					>
					<input
						type="text"
						:value="config.color"
						class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						@input="updateConfig({ color: ($event.target as HTMLInputElement).value })"
					>
				</div>
			</div>
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Background</label>
				<div class="flex items-center gap-2">
					<input
						type="color"
						:value="config.backgroundColor"
						class="w-8 h-8 rounded cursor-pointer"
						@input="updateConfig({
							backgroundColor: ($event.target as HTMLInputElement).value,
						})"
					>
					<input
						type="text"
						:value="config.backgroundColor"
						class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						@input="updateConfig({
							backgroundColor: ($event.target as HTMLInputElement).value,
						})"
					>
				</div>
			</div>
		</div>

		<div class="space-y-1">
			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400">Size:</label>
				<span class="text-xs text-gray-500">{{ config.size }}px</span>
			</div>
			<input
				type="range"
				min="100"
				max="1000"
				step="50"
				:value="config.size"
				class="w-full"
				@input="updateConfig({
					size: Number(($event.target as HTMLInputElement).value),
				})"
			>
		</div>

		<div>
			<label class="text-xs text-gray-600 dark:text-gray-400"
			>Error Correction</label>
			<select
				:value="config.errorCorrection"
				class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
				@change="updateConfig({
					errorCorrection: ($event.target as HTMLSelectElement)
						.value as QRCodeConfig['errorCorrection'],
				})"
			>
				<option
					v-for="level in errorLevels"
					:key="level.value"
					:value="level.value"
				>
					{{ level.label }}
				</option>
			</select>
		</div>

		<div class="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
			<div
				class="w-24 h-24 bg-white rounded flex items-center justify-center"
				:style="{ backgroundColor: config.backgroundColor }"
			>
				<svg class="w-20 h-20" viewBox="0 0 100 100">
					<rect width="100" height="100" :fill="config.backgroundColor" />
					<g :fill="config.color">
						<rect x="10" y="10" width="25" height="25" />
						<rect x="65" y="10" width="25" height="25" />
						<rect x="10" y="65" width="25" height="25" />
						<rect x="40" y="40" width="20" height="20" />
						<rect x="15" y="40" width="10" height="10" />
						<rect x="75" y="40" width="10" height="10" />
						<rect x="40" y="15" width="10" height="10" />
						<rect x="40" y="75" width="10" height="10" />
						<rect x="65" y="65" width="5" height="5" />
						<rect x="75" y="65" width="5" height="5" />
						<rect x="85" y="65" width="5" height="5" />
						<rect x="65" y="75" width="5" height="5" />
						<rect x="85" y="75" width="5" height="5" />
						<rect x="65" y="85" width="5" height="5" />
						<rect x="75" y="85" width="5" height="5" />
						<rect x="85" y="85" width="5" height="5" />
					</g>
				</svg>
			</div>
		</div>

		<button
			type="button"
			class="w-full py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
			@click="$emit('generate')"
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
					d="M12 4v16m8-8H4"
				/>
			</svg>
			Generate QR Code
		</button>
	</div>
</template>
