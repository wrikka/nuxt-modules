<script setup lang="ts">
interface Cursor {
	id: string;
	name: string;
	color: string;
	x: number;
	y: number;
	isTyping: boolean;
}

const cursors = ref<Cursor[]>([
	{
		id: "1",
		name: "Alice Chen",
		color: "#FF6B6B",
		x: 200,
		y: 150,
		isTyping: true,
	},
	{
		id: "2",
		name: "Bob Smith",
		color: "#4ECDC4",
		x: 450,
		y: 280,
		isTyping: false,
	},
	{ id: "3", name: "You", color: "#45B7D1", x: 320, y: 200, isTyping: false },
]);

const isLive = ref(true);
const showCursors = ref(true);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-3">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Live Collaboration
				</h3>
				<span
					v-if="isLive"
					class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full flex items-center gap-1"
				>
					<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
					Live
				</span>
			</div>
			<div class="flex items-center gap-2">
				<button
					@click="showCursors = !showCursors"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon
						:name="showCursors ? 'mdi:cursor-default' : 'mdi:cursor-default-outline'"
						class="w-5 h-5"
					/>
				</button>
			</div>
		</div>

		<!-- Canvas Preview -->
		<div class="relative h-64 bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 overflow-hidden">
			<div class="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-10">
				<div v-for="i in 48" :key="i" class="border border-gray-400" />
			</div>

			<!-- User Cursors -->
			<div
				v-for="cursor in cursors"
				:key="cursor.id"
				v-show="showCursors"
				class="absolute transition-all duration-300"
				:style="{ left: `${cursor.x}px`, top: `${cursor.y}px` }"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" :fill="cursor.color">
					<path d="M3 3L10 21L13 13L21 10L3 3Z" />
				</svg>
				<span
					class="absolute left-5 top-5 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
					:style="{ backgroundColor: cursor.color }"
				>
					{{ cursor.name }}
					<span v-if="cursor.isTyping" class="ml-1">typing...</span>
				</span>
			</div>
		</div>

		<!-- Active Users -->
		<div class="space-y-2">
			<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Active Users ({{ cursors.length }})
			</h4>
			<div class="flex flex-wrap gap-2">
				<div
					v-for="user in cursors"
					:key="user.id"
					class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-full"
				>
					<span
						class="w-2 h-2 rounded-full"
						:style="{ backgroundColor: user.color }"
					/>
					<span class="text-sm">{{ user.name }}</span>
					<span v-if="user.isTyping" class="text-xs text-gray-500">✏️</span>
				</div>
			</div>
		</div>
	</div>
</template>
