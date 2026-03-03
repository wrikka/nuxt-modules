<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	message?: string;
	type?: "info" | "success" | "warning" | "error";
	duration?: number;
}>();

const emit = defineEmits<{ close: [] }>();

const icons = {
	info: "mdi:information",
	success: "mdi:check-circle",
	warning: "mdi:alert",
	error: "mdi:close-circle",
};

const colors = {
	info: "bg-blue-500",
	success: "bg-green-500",
	warning: "bg-yellow-500",
	error: "bg-red-500",
};

onMounted(() => {
	if (props.duration) {
		setTimeout(() => emit("close"), props.duration);
	}
});
</script>

<template>
	<Teleport to="body">
		<div
			v-if="isOpen"
			class="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2"
		>
			<div
				:class="[
					'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white',
					colors[type || 'info'],
				]"
			>
				<Icon :name="icons[type || 'info']" class="w-5 h-5" />
				<span class="font-medium">{{ message || "Notification" }}</span>
				<button @click="emit('close')" class="p-1 hover:bg-white/20 rounded">
					<Icon name="mdi:close" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</Teleport>
</template>
