<script setup lang="ts">
import type { Slide } from "../types";

const props = defineProps<{
	slides: Slide[];
	currentSlideIndex: number;
}>();

const emit = defineEmits<{
	join: [sessionId: string];
	leave: [];
	share: [];
}>();

const isOpen = ref(false);
const sessionId = ref("");
const userName = ref("");
const isConnected = ref(false);
const collaborators = ref<
	Array<{
		id: string;
		name: string;
		color: string;
		cursor?: { x: number; y: number };
	}>
>([]);

const colors = [
	"#3b82f6",
	"#8b5cf6",
	"#f59e0b",
	"#10b981",
	"#ef4444",
	"#ec4899",
];

function generateSessionId() {
	return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function createSession() {
	if (!userName.value.trim()) {
		alert("Please enter your name");
		return;
	}
	sessionId.value = generateSessionId();
	isConnected.value = true;
	collaborators.value = [
		{
			id: "me",
			name: userName.value,
			color: colors[0]!,
		},
	];
}

function joinSession() {
	if (!sessionId.value.trim() || !userName.value.trim()) {
		alert("Please enter session ID and your name");
		return;
	}
	isConnected.value = true;
	emit("join", sessionId.value);
	collaborators.value = [
		{ id: "me", name: userName.value, color: colors[0]! },
		{ id: "user2", name: "Alice", color: colors[1]! },
		{ id: "user3", name: "Bob", color: colors[2]! },
	];
}

function leaveSession() {
	isConnected.value = false;
	collaborators.value = [];
	emit("leave");
}

function shareSession() {
	emit("share");
	// Copy to clipboard
	const url = `${window.location.origin}${window.location.pathname}?session=${sessionId.value}`;
	navigator.clipboard.writeText(url);
	alert("Session link copied to clipboard!");
}
</script>

<template>
	<div class="relative">
		<button
			class="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
			:class="{ 'bg-green-600': isConnected }"
			@click="isOpen = !isOpen"
			title="Collaborative Editing"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
			<span v-if="isConnected" class="text-sm">{{ collaborators.length }}</span>
		</button>

		<div
			v-if="isOpen"
			class="absolute bottom-full mb-2 right-0 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-4 min-w-[280px] z-50"
		>
			<div class="text-xs text-gray-400 uppercase tracking-wider mb-3">Collaborative Editing</div>

			<div v-if="!isConnected" class="space-y-3">
				<div>
					<label class="text-sm text-gray-300 block mb-1">Your Name</label>
					<input
						v-model="userName"
						type="text"
						placeholder="Enter your name"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
					/>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<button
						class="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
						@click="createSession"
					>
						Create Session
					</button>
					<button
						class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
						@click="joinSession"
					>
						Join Session
					</button>
				</div>

				<div v-if="sessionId" class="pt-2 border-t border-gray-700">
					<label class="text-sm text-gray-300 block mb-1">Session ID</label>
					<div class="flex gap-2">
						<input
							v-model="sessionId"
							type="text"
							readonly
							class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
						/>
						<button
							class="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm transition-colors"
							@click="shareSession"
						>
							Copy
						</button>
					</div>
				</div>
			</div>

			<div v-else class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-green-400">Connected</span>
					<span class="text-xs text-gray-500">Session: {{ sessionId }}</span>
				</div>

				<div class="space-y-2">
					<div class="text-xs text-gray-400 uppercase tracking-wider">Collaborators ({{ collaborators.length }})</div>
					<div class="flex flex-wrap gap-2">
						<div
							v-for="user in collaborators"
							:key="user.id"
							class="flex items-center gap-2 px-2 py-1 rounded-full text-xs"
							:style="{ backgroundColor: `${user.color}20`, color: user.color, border: `1px solid ${user.color}` }"
						>
							<div class="w-2 h-2 rounded-full" :style="{ backgroundColor: user.color }" />
							{{ user.name }}
						</div>
					</div>
				</div>

				<div class="pt-2 border-t border-gray-700 space-y-2">
					<button
						class="w-full px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm transition-colors"
						@click="shareSession"
					>
						Share Invite Link
					</button>
					<button
						class="w-full px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-colors"
						@click="leaveSession"
					>
						Leave Session
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
