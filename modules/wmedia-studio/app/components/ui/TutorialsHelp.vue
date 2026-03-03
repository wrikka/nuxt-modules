<script setup lang="ts">
const emit = defineEmits<{ close: []; openTutorial: [id: string] }>();
const searchQuery = ref("");
const tutorials = ref([
	{
		id: "1",
		title: "Getting Started",
		category: "Beginner",
		duration: "5 min",
		icon: "mdi:play-circle",
	},
	{
		id: "2",
		title: "Video Editing Basics",
		category: "Beginner",
		duration: "10 min",
		icon: "mdi:film",
	},
	{
		id: "3",
		title: "AI Features Guide",
		category: "Advanced",
		duration: "15 min",
		icon: "mdi:sparkles",
	},
]);
const filteredTutorials = computed(() =>
	tutorials.value.filter(t =>
		t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
	)
);
</script>
<template>
	<div class="tutorials-help bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:school" class="w-5 h-5 text-blue-500" />
				Tutorials & Help
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<input
			v-model="searchQuery"
			type="text"
			placeholder="Search tutorials..."
			class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm mb-4 border-0"
		/>
		<div class="flex-1 overflow-y-auto space-y-2">
			<div
				v-for="t in filteredTutorials"
				:key="t.id"
				class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
				@click="emit('openTutorial', t.id)"
			>
				<Icon :name="t.icon" class="w-8 h-8 text-blue-500" />
				<div class="flex-1">
					<div class="text-gray-900 dark:text-white text-sm font-medium">
						{{ t.title }}
					</div>
					<div class="text-gray-500 text-xs">
						{{ t.category }} • {{ t.duration }}
					</div>
				</div>
				<Icon name="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
			</div>
		</div>
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase tracking-wider font-medium">
				Quick Links
			</div>
			<div class="flex gap-2">
				<a href="#" class="text-blue-500 text-xs hover:underline"
				>Documentation</a>
				<a href="#" class="text-blue-500 text-xs hover:underline">Community</a>
				<a href="#" class="text-blue-500 text-xs hover:underline">Support</a>
			</div>
		</div>
	</div>
</template>
