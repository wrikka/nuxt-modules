<script setup lang="ts">
export interface ShadowConfig {
	enabled: boolean;
	color: string;
	blur: number;
	offsetX: number;
	offsetY: number;
}

const props = defineProps<{
	modelValue: ShadowConfig;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: ShadowConfig): void;
}>();

const updateShadow = (updates: Partial<ShadowConfig>) => {
	emit("update:modelValue", { ...props.modelValue, ...updates });
};

const shadowStyle = computed(() => {
	if (!props.modelValue.enabled) return "none";
	const { offsetX, offsetY, blur, color } = props.modelValue;
	return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
});
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
			>Drop Shadow</label>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					:checked="modelValue.enabled"
					class="sr-only peer"
					@change="updateShadow({
						enabled: ($event.target as HTMLInputElement).checked,
					})"
				>
				<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
			</label>
		</div>

		<div
			v-if="modelValue.enabled"
			class="space-y-3 pl-2 border-l-2 border-gray-200 dark:border-gray-600"
		>
			<div class="flex items-center gap-2">
				<label class="text-xs text-gray-600 dark:text-gray-400 w-16"
				>Color:</label>
				<input
					type="color"
					:value="modelValue.color"
					class="w-8 h-8 rounded cursor-pointer"
					@input="updateShadow({ color: ($event.target as HTMLInputElement).value })"
				>
				<input
					type="text"
					:value="modelValue.color"
					class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
					@input="updateShadow({ color: ($event.target as HTMLInputElement).value })"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400">Blur:</label>
					<span class="text-xs text-gray-500">{{ modelValue.blur }}px</span>
				</div>
				<input
					type="range"
					min="0"
					max="50"
					:value="modelValue.blur"
					class="w-full"
					@input="updateShadow({
						blur: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Offset X:</label>
					<span class="text-xs text-gray-500">{{ modelValue.offsetX }}px</span>
				</div>
				<input
					type="range"
					min="-50"
					max="50"
					:value="modelValue.offsetX"
					class="w-full"
					@input="updateShadow({
						offsetX: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Offset Y:</label>
					<span class="text-xs text-gray-500">{{ modelValue.offsetY }}px</span>
				</div>
				<input
					type="range"
					min="-50"
					max="50"
					:value="modelValue.offsetY"
					class="w-full"
					@input="updateShadow({
						offsetY: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>
		</div>

		<div
			class="w-16 h-16 rounded-lg bg-blue-500 mx-auto"
			:style="{ boxShadow: shadowStyle }"
		/>
	</div>
</template>
