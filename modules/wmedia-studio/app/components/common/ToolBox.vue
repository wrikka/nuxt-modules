<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();
const tabs = [
	{ id: "ai", name: "AI Tools", icon: "mdi:robot" },
	{ id: "design", name: "Design", icon: "mdi:palette" },
	{ id: "video", name: "Video", icon: "mdi:video" },
	{ id: "audio", name: "Audio", icon: "mdi:music" },
];
const activeTab = ref("ai");
const aiTools = [
	"Background Remover",
	"Smart Crop",
	"Upscale",
	"Style Transfer",
	"Auto Tag",
];
const designTools = [
	"Brand Kit",
	"Color Palette",
	"Font Pairing",
	"Layout Grid",
];
</script>
<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl h-[70vh] shadow-2xl flex overflow-hidden">
			<div class="w-56 border-r border-gray-200 dark:border-gray-700 p-4">
				<h2 class="text-lg font-bold mb-4">Tool Box</h2>
				<nav class="space-y-1">
					<button
						v-for="tab in tabs"
						:key="tab.id"
						@click="activeTab = tab.id"
						:class="[
							'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
							activeTab === tab.id
								? 'bg-blue-500 text-white'
								: 'hover:bg-gray-100 dark:hover:bg-gray-700',
						]"
					>
						<Icon :name="tab.icon" class="w-4 h-4" />{{ tab.name }}
					</button>
				</nav>
			</div>
			<div class="flex-1 p-6 overflow-y-auto">
				<div v-if="activeTab === 'ai'" class="grid grid-cols-2 gap-3">
					<button
						v-for="tool in aiTools"
						:key="tool"
						class="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:scale-105 transition-transform"
					>
						{{ tool }}
					</button>
				</div>
				<div v-if="activeTab === 'design'" class="grid grid-cols-2 gap-3">
					<button
						v-for="tool in designTools"
						:key="tool"
						class="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover:scale-105 transition-transform"
					>
						{{ tool }}
					</button>
				</div>
				<div v-else class="text-center py-12 text-gray-500">
					<Icon
						:name="tabs.find(t => t.id === activeTab)?.icon || 'mdi:help'"
						class="w-12 h-12 mx-auto mb-3"
					/><p>
						{{ tabs.find(t => t.id === activeTab)?.name }} tools coming soon
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
