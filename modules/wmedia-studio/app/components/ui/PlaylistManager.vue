<script setup lang="ts">
const emit = defineEmits<{ close: []; play: [id: string]; reorder: [] }>();
const playlist = ref([
	{ id: "1", title: "Intro Clip", duration: "00:15", type: "video" },
	{ id: "2", title: "Main Content", duration: "10:30", type: "video" },
	{ id: "3", title: "Outro", duration: "00:20", type: "video" },
]);
const currentIndex = ref(0);
const isPlaying = ref(false);
const totalDuration = computed(() => {
	let total = 0;
	playlist.value.forEach(item => {
		const [m = 0, s = 0] = item.duration.split(":").map(Number);
		total += m * 60 + s;
	});
	return `${String(Math.floor(total / 60)).padStart(2, "0")}:${
		String(total % 60).padStart(2, "0")
	}`;
});
const play = (id: string) => {
	currentIndex.value = playlist.value.findIndex(p => p.id === id);
	emit("play", id);
};
</script>
<template>
	<div class="playlist-manager bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:playlist-play" class="w-5 h-5 text-blue-500" />
				Playlist Manager
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-2 mb-4">
			<div
				v-for="(item, i) in playlist"
				:key="item.id"
				class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
				:class="i === currentIndex
				? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
				: 'bg-gray-50 dark:bg-gray-700/30'"
				@click="play(item.id)"
			>
				<div class="w-6 text-center text-gray-500 dark:text-gray-400 text-sm">
					{{ i + 1 }}
				</div>
				<Icon
					:name="item.type === 'video' ? 'mdi:file-video' : 'mdi:music'"
					class="w-5 h-5 text-gray-500 dark:text-gray-400"
				/>
				<div class="flex-1">
					<div class="text-gray-900 dark:text-white text-sm">
						{{ item.title }}
					</div>
					<div class="text-gray-500 dark:text-gray-400 text-xs">
						{{ item.duration }}
					</div>
				</div>
				<button v-if="i === currentIndex" class="text-blue-500">
					<Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-4 h-4" />
				</button>
				<button
					class="text-gray-400 hover:text-red-500"
					@click.stop="playlist.splice(i, 1)"
				>
					<Icon name="mdi:close" class="w-4 h-4" />
				</button>
			</div>
		</div>
		<div class="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
			<div class="text-gray-500 dark:text-gray-400 text-xs">
				{{ playlist.length }} items • {{ totalDuration }}
			</div>
			<div class="flex gap-2">
				<button
					class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-xs transition-colors"
					@click="emit('reorder')"
				>
					Reorder
				</button>
				<button class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium">
					Add
				</button>
			</div>
		</div>
	</div>
</template>
