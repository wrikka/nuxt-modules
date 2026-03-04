<script setup lang="ts">
const props = defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
	(e: "eyedropper"): void;
}>();

const colorInputRef = ref<HTMLInputElement | null>(null);

const handleColorChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.value);
};

const handleEyedropper = () => {
	emit("eyedropper");
};

const openColorPicker = () => {
	colorInputRef.value?.click();
};
</script>

<template>
	<div class="flex items-center gap-2">
		<div
			class="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer shadow-sm"
			:style="{ backgroundColor: modelValue }"
			@click="openColorPicker"
		/>
		<input
			ref="colorInputRef"
			type="color"
			:value="modelValue"
			class="hidden"
			@input="handleColorChange"
		>
		<input
			:type="'text'"
			:value="modelValue"
			class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
			@input="handleColorChange"
		>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
			title="Eyedropper (I)"
			@click="handleEyedropper"
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
					d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
				/>
			</svg>
		</button>
	</div>
</template>
