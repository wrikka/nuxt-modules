<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();

const resources = [
	{ name: "Documentation", icon: "mdi:book", url: "/docs" },
	{ name: "Video Tutorials", icon: "mdi:play-circle", url: "/tutorials" },
	{ name: "Keyboard Shortcuts", icon: "mdi:keyboard", url: "/shortcuts" },
	{ name: "Community Forum", icon: "mdi:account-group", url: "/forum" },
	{ name: "Submit Feedback", icon: "mdi:message-text", url: "/feedback" },
	{ name: "Contact Support", icon: "mdi:headphones", url: "/support" },
];
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-xl font-bold text-gray-900 dark:text-white">
					Help & Resources
				</h3>
				<button @click="emit('close')" class="p-2 hover:bg-gray-100 rounded-lg">
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
			<div class="space-y-2">
				<a
					v-for="resource in resources"
					:key="resource.name"
					:href="resource.url"
					class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
				>
					<Icon :name="resource.icon" class="w-5 h-5 text-blue-500" />
					<span class="text-gray-900 dark:text-white">{{ resource.name }}</span>
					<Icon
						name="mdi:chevron-right"
						class="w-4 h-4 ml-auto text-gray-400"
					/>
				</a>
			</div>
		</div>
	</div>
</template>
