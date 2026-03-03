<script setup lang="ts">
const collaborators = ref([
	{ id: 1, name: "Alice", color: "#EF4444", x: 120, y: 80, isTyping: true },
	{ id: 2, name: "Bob", color: "#10B981", x: 350, y: 200, isTyping: false },
	{ id: 3, name: "Carol", color: "#3B82F6", x: 500, y: 150, isTyping: true },
]);

const showCursors = ref(true);
</script>

<template>
	<div class="relative">
		<!-- Toggle -->
		<button
			class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
			:class="showCursors
			? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
			: 'bg-gray-100 dark:bg-gray-700'"
			@click="showCursors = !showCursors"
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
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
				/>
			</svg>
			<span>{{ showCursors ? "3 online" : "Hidden" }}</span>
		</button>

		<!-- Collaborator Cursors (Floating on Canvas) -->
		<div v-if="showCursors" class="pointer-events-none fixed inset-0 z-40">
			<div
				v-for="user in collaborators"
				:key="user.id"
				class="absolute transition-all duration-300 ease-out"
				:style="{ left: `${user.x}px`, top: `${user.y}px` }"
			>
				<!-- Cursor Icon -->
				<svg
					class="w-6 h-6"
					viewBox="0 0 24 24"
					fill="none"
					:style="{ color: user.color }"
				>
					<path
						d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.45.45 0 00.32-.77L6.18 2.95a.45.45 0 00-.68.26z"
						fill="currentColor"
					/>
				</svg>

				<!-- Name Badge -->
				<div
					class="absolute left-4 top-4 px-2 py-0.5 rounded-full text-xs text-white font-medium whitespace-nowrap"
					:style="{ backgroundColor: user.color }"
				>
					{{ user.name }}
					<span v-if="user.isTyping" class="ml-1 animate-pulse">...</span>
				</div>
			</div>
		</div>

		<!-- User List -->
		<div class="mt-2 flex -space-x-2">
			<div
				v-for="user in collaborators"
				:key="user.id"
				class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium"
				:style="{ backgroundColor: user.color }"
				:title="user.name"
			>
				{{ user.name[0] }}
			</div>
			<div class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
				+2
			</div>
		</div>
	</div>
</template>
