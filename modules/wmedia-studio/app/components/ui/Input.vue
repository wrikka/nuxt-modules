<script setup lang="ts">
interface Props {
	id?: string;
	type?: "text" | "email" | "password" | "number" | "url";
	modelValue?: string | number;
	placeholder?: string;
	disabled?: boolean;
	error?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	disabled: false,
});

defineEmits<{
	"update:modelValue": [value: string | number];
}>();

const disabledClasses = computed(() => {
	if (props.disabled) {
		return "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400";
	}
	return "border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white";
});
</script>

<template>
	<div class="relative">
		<input
			:id="id"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:class="[
				'w-full px-3 py-2 border rounded-lg transition-colors',
				'focus:outline-none focus:ring-2 focus:ring-blue-500',
				disabledClasses,
			]"
			@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		/>
		<div v-if="error" class="mt-1 text-sm text-red-500">
			{{ error }}
		</div>
	</div>
</template>
