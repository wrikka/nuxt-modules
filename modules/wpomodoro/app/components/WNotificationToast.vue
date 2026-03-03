<script setup lang="ts">
const props = defineProps<{
	title: string
	message: string
	type?: "success" | "info" | "warning"
}>()

const emit = defineEmits<{
	close: []
}>()

const bgColor = computed(() => {
	switch (props.type) {
		case "success":
			return "bg-green-500"
		case "warning":
			return "bg-yellow-500"
		default:
			return "bg-blue-500"
	}
})

onMounted(() => {
	setTimeout(() => {
		emit("close")
	}, 5000)
})
</script>

<template>
	<div
		class="pointer-events-none fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-lg p-4 text-white shadow-lg transition-all"
		:class="bgColor"
	>
		<div class="flex-shrink-0">
			<svg v-if="type === 'success'" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<svg v-else-if="type === 'warning'" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<div class="flex-1">
			<h4 class="font-medium">{{ title }}</h4>
			<p class="text-sm opacity-90">{{ message }}</p>
		</div>
	</div>
</template>
