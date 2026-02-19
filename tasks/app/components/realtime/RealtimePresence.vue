<script setup lang="ts">
import { useRealtimeSync } from "../../composables/useRealtimeSync"

const { cursors, activeUsers, isConnected } = useRealtimeSync()

const containerRef = ref<HTMLElement>()

function handleMouseMove(e: MouseEvent) {
	if (!containerRef.value) return
	const rect = containerRef.value.getBoundingClientRect()
	// Send cursor position to server
	// useRealtimeSync().sendCursorPosition(e.clientX - rect.left, e.clientY - rect.top, userId, user)
}
</script>

<template>
	<div
		ref="containerRef"
		class="relative"
		@mousemove="handleMouseMove"
	>
		<slot />

		<!-- Connection Status -->
		<div
			class="fixed bottom-4 right-4 px-3 py-1 rounded-full text-sm flex items-center gap-2 z-50"
			:class="isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
		>
			<span
				class="w-2 h-2 rounded-full"
				:class="isConnected ? 'bg-green-500' : 'bg-red-500'"
			/>
			{{ isConnected ? 'Connected' : 'Disconnected' }}
		</div>

		<!-- Active Users -->
		<div class="fixed top-4 right-4 flex -space-x-2 z-50">
			<div
				v-for="user in activeUsers"
				:key="user.name"
				class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs text-white"
				:style="{ backgroundColor: user.avatarUrl ? 'transparent' : '#3b82f6' }"
				:title="user.name"
			>
				<img
					v-if="user.avatarUrl"
					:src="user.avatarUrl"
					:alt="user.name"
					class="w-full h-full rounded-full object-cover"
				>
				<span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
			</div>
		</div>

		<!-- Remote Cursors -->
		<div
			v-for="cursor in cursors"
			:key="cursor.userId"
			class="absolute pointer-events-none z-40 transition-all duration-100"
			:style="{ left: `${cursor.x}px`, top: `${cursor.y}px` }"
		>
			<div class="flex items-start gap-1">
				<svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
					<path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.45.45 0 0 0 .32-.77L6.18 2.8a.45.45 0 0 0-.68.41Z" />
				</svg>
				<span
					class="px-2 py-1 rounded text-xs text-white whitespace-nowrap"
					:style="{ backgroundColor: cursor.user.avatarUrl ? '#3b82f6' : '#8b5cf6' }"
				>
					{{ cursor.user.name }}
				</span>
			</div>
		</div>
	</div>
</template>
