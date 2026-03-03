<script setup lang="ts">
interface CursorUser {
	id: string;
	name: string;
	color: string;
	x: number;
	y: number;
	isTyping: boolean;
	avatar?: string;
}

const users = ref<CursorUser[]>([
	{
		id: "1",
		name: "Alice Chen",
		color: "#FF5733",
		x: 320,
		y: 180,
		isTyping: false,
		avatar: "/avatars/alice.jpg",
	},
	{
		id: "2",
		name: "Bob Smith",
		color: "#33FF57",
		x: 450,
		y: 280,
		isTyping: true,
		avatar: "/avatars/bob.jpg",
	},
	{
		id: "3",
		name: "Carol Wu",
		color: "#3357FF",
		x: 180,
		y: 350,
		isTyping: false,
		avatar: "/avatars/carol.jpg",
	},
]);

const currentUser = ref<CursorUser>({
	id: "current",
	name: "You",
	color: "#FF33A1",
	x: 0,
	y: 0,
	isTyping: false,
});

const showUserList = ref(true);
const containerRef = ref<HTMLElement | null>(null);

function handleMouseMove(event: MouseEvent) {
	if (!containerRef.value) return;
	const rect = containerRef.value.getBoundingClientRect();
	currentUser.value.x = event.clientX - rect.left;
	currentUser.value.y = event.clientY - rect.top;
}

function getCursorStyle(user: CursorUser): Record<string, string> {
	return {
		left: `${user.x}px`,
		top: `${user.y}px`,
		"--cursor-color": user.color,
	};
}
</script>

<template>
	<div class="live-cursor-presence">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:cursor-pointer" class="mr-2" />
			Live Cursor Presence
		</h2>
		<p class="text-gray-500 mb-6">
			See team members' cursor positions in real-time
		</p>

		<!-- User List Panel -->
		<div
			v-if="showUserList"
			class="user-list-panel bg-white border rounded-lg p-4 mb-4 shadow-lg"
		>
			<h3 class="font-semibold mb-3 flex items-center gap-2">
				<Icon name="mdi:account-group" />
				Active Users ({{ users.length + 1 }})
			</h3>
			<div class="space-y-2">
				<div
					v-for="user in users"
					:key="user.id"
					class="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
				>
					<div
						class="w-3 h-3 rounded-full"
						:style="{ backgroundColor: user.color }"
					/>
					<img
						v-if="user.avatar"
						:src="user.avatar"
						class="w-8 h-8 rounded-full object-cover"
						:alt="user.name"
					/>
					<div
						v-else
						class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm"
					>
						{{ user.name.charAt(0) }}
					</div>
					<span class="flex-1">{{ user.name }}</span>
					<span
						v-if="user.isTyping"
						class="text-xs text-blue-500 animate-pulse"
					>
						typing...
					</span>
				</div>
				<div class="flex items-center gap-3 p-2 rounded bg-blue-50">
					<div
						class="w-3 h-3 rounded-full"
						:style="{ backgroundColor: currentUser.color }"
					/>
					<div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
						Y
					</div>
					<span class="flex-1 font-medium">{{ currentUser.name }} (You)</span>
				</div>
			</div>
		</div>

		<!-- Collaborative Canvas -->
		<div
			ref="containerRef"
			class="collaborative-canvas relative bg-gray-100 rounded-lg overflow-hidden"
			style="height: 400px"
			@mousemove="handleMouseMove"
		>
			<!-- Canvas Content -->
			<div class="absolute inset-0 p-8">
				<div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
					<h4 class="font-semibold mb-4">Collaborative Design Canvas</h4>
					<div class="space-y-3">
						<div class="h-4 bg-gray-200 rounded w-3/4"></div>
						<div class="h-4 bg-gray-200 rounded w-1/2"></div>
						<div class="h-4 bg-gray-200 rounded w-5/6"></div>
					</div>
					<div class="mt-4 flex gap-2">
						<div class="w-20 h-20 bg-blue-100 rounded"></div>
						<div class="w-20 h-20 bg-green-100 rounded"></div>
						<div class="w-20 h-20 bg-yellow-100 rounded"></div>
					</div>
				</div>
			</div>

			<!-- Remote User Cursors -->
			<div
				v-for="user in users"
				:key="user.id"
				class="remote-cursor absolute pointer-events-none transition-all duration-100"
				:style="getCursorStyle(user)"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M3 3L10 21L13 14L20 11L3 3Z"
						:fill="user.color"
						stroke="white"
						stroke-width="2"
					/>
				</svg>
				<div
					class="cursor-label px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap"
					:style="{ backgroundColor: user.color }"
				>
					{{ user.name }}
				</div>
				<div
					v-if="user.isTyping"
					class="typing-indicator mt-1 flex gap-1"
				>
					<span
						class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
						style="animation-delay: 0ms"
					/>
					<span
						class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
						style="animation-delay: 150ms"
					/>
					<span
						class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
						style="animation-delay: 300ms"
					/>
				</div>
			</div>

			<!-- Current User Cursor -->
			<div
				class="current-cursor absolute pointer-events-none"
				:style="getCursorStyle(currentUser)"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M3 3L10 21L13 14L20 11L3 3Z"
						:fill="currentUser.color"
						stroke="white"
						stroke-width="2"
					/>
				</svg>
			</div>

			<!-- Presence Indicators -->
			<div class="absolute bottom-4 right-4 flex gap-2">
				<button
					@click="showUserList = !showUserList"
					class="bg-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-50"
				>
					<div class="flex -space-x-2">
						<div
							v-for="user in users.slice(0, 3)"
							:key="user.id"
							class="w-6 h-6 rounded-full border-2 border-white"
							:style="{ backgroundColor: user.color }"
						/>
					</div>
					<span class="text-sm">{{ users.length + 1 }} active</span>
				</button>
			</div>
		</div>

		<!-- Instructions -->
		<div class="mt-4 text-sm text-gray-500">
			<p>
				<Icon name="mdi:information" class="mr-1" />
				Move your mouse to see real-time cursor tracking. Other users' cursors
				appear as they move.
			</p>
		</div>
	</div>
</template>

<style scoped>
.live-cursor-presence {
	padding: 1.5rem;
}

.collaborative-canvas {
	cursor: none;
}

.remote-cursor,
.current-cursor {
	z-index: 100;
}

.cursor-label {
	position: absolute;
	left: 16px;
	top: 0;
	border-radius: 4px;
}

.typing-indicator {
	position: absolute;
	left: 16px;
	top: 28px;
	background: white;
	padding: 4px 8px;
	border-radius: 4px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes bounce {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-4px);
	}
}

.animate-bounce {
	animation: bounce 0.6s infinite;
}
</style>
