<script setup lang="ts">
export interface TextStyle {
	name: string;
	fontSize: number;
	fontWeight: string;
	lineHeight: number;
	letterSpacing: number;
	fontFamily: string;
}

const textStyles: TextStyle[] = [
	{
		name: "H1",
		fontSize: 48,
		fontWeight: "bold",
		lineHeight: 1.2,
		letterSpacing: -0.02,
		fontFamily: "system-ui",
	},
	{
		name: "H2",
		fontSize: 36,
		fontWeight: "bold",
		lineHeight: 1.3,
		letterSpacing: -0.01,
		fontFamily: "system-ui",
	},
	{
		name: "H3",
		fontSize: 28,
		fontWeight: "600",
		lineHeight: 1.4,
		letterSpacing: -0.01,
		fontFamily: "system-ui",
	},
	{
		name: "H4",
		fontSize: 24,
		fontWeight: "600",
		lineHeight: 1.4,
		letterSpacing: 0,
		fontFamily: "system-ui",
	},
	{
		name: "H5",
		fontSize: 20,
		fontWeight: "600",
		lineHeight: 1.5,
		letterSpacing: 0,
		fontFamily: "system-ui",
	},
	{
		name: "H6",
		fontSize: 16,
		fontWeight: "600",
		lineHeight: 1.5,
		letterSpacing: 0,
		fontFamily: "system-ui",
	},
	{
		name: "Body",
		fontSize: 16,
		fontWeight: "normal",
		lineHeight: 1.6,
		letterSpacing: 0,
		fontFamily: "system-ui",
	},
	{
		name: "Caption",
		fontSize: 12,
		fontWeight: "normal",
		lineHeight: 1.5,
		letterSpacing: 0.01,
		fontFamily: "system-ui",
	},
	{
		name: "Label",
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 1.4,
		letterSpacing: 0.01,
		fontFamily: "system-ui",
	},
];

const emit = defineEmits<{
	(e: "select", style: TextStyle): void;
}>();
</script>

<template>
	<div class="space-y-1">
		<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
		>Text Styles</label>
		<div class="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
			<button
				v-for="style in textStyles"
				:key="style.name"
				type="button"
				class="flex items-center gap-3 p-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
				@click="$emit('select', style)"
			>
				<span
					class="text-gray-900 dark:text-white"
					:style="{
						fontSize: `${Math.min(style.fontSize, 24)}px`,
						fontWeight: style.fontWeight,
						fontFamily: style.fontFamily,
					}"
				>
					Aa
				</span>
				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium text-gray-700 dark:text-gray-300">
						{{ style.name }}
					</div>
					<div class="text-xs text-gray-500 dark:text-gray-400 truncate">
						{{ style.fontSize }}px / {{ style.fontWeight }}
					</div>
				</div>
			</button>
		</div>
	</div>
</template>
