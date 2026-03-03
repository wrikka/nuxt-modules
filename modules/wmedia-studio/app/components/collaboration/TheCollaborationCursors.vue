<script setup lang="ts">
import { useCollaborationStore } from "~/stores/collaboration";

const collaborationStore = useCollaborationStore();
const { collaborators } = storeToRefs(collaborationStore);

const activeCollaborators = computed(() => {
	return Array.from(collaborators.value.values()).filter(
		(c) => c.status === "active" && c.cursor,
	);
});

const getInitials = (name: string) => {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

const getRandomColor = (userId: string) => {
	const colors = [
		"#ef4444", // red
		"#f97316", // orange
		"#eab308", // yellow
		"#22c55e", // green
		"#06b6d4", // cyan
		"#3b82f6", // blue
		"#8b5cf6", // purple
		"#ec4899", // pink
	];
	let hash = 0;
	for (let i = 0; i < userId.length; i++) {
		hash = userId.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
};
</script>

<template>
	<div class="pointer-events-none absolute inset-0 z-50 overflow-hidden">
		<!-- Remote Cursors -->
		<div
			v-for="collaborator in activeCollaborators"
			:key="collaborator.userId"
			class="absolute transition-all duration-75 ease-out"
			:style="{
				left: `${collaborator.cursor?.x}px`,
				top: `${collaborator.cursor?.y}px`,
			}"
		>
			<!-- Cursor Icon -->
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				class="-ml-1 -mt-1"
				:style="{ color: getRandomColor(collaborator.userId) }"
			>
				<path
					d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
					:fill="getRandomColor(collaborator.userId)"
					stroke="white"
					stroke-width="2"
					stroke-linejoin="round"
				/>
			</svg>

			<!-- User Label -->
			<div
				class="absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-white shadow-lg"
				:style="{ backgroundColor: getRandomColor(collaborator.userId) }"
			>
				<span
					v-if="collaborator.userAvatar"
					class="h-4 w-4 overflow-hidden rounded-full"
				>
					<img
						:src="collaborator.userAvatar"
						:alt="collaborator.userName"
						class="h-full w-full object-cover"
					/>
				</span>
				<span
					v-else
					class="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[8px]"
				>
					{{ getInitials(collaborator.userName) }}
				</span>
				<span class="whitespace-nowrap">{{ collaborator.userName }}</span>
			</div>
		</div>

		<!-- Remote Selections -->
		<template
			v-for="collaborator in activeCollaborators"
			:key="`selection-${collaborator.userId}`"
		>
			<div
				v-if="collaborator.selection"
				class="absolute pointer-events-none"
				:style="{
					left: `${collaborator.selection.x}px`,
					top: `${collaborator.selection.y}px`,
					width: `${collaborator.selection.width}px`,
					height: `${collaborator.selection.height}px`,
				}"
			>
				<div
					class="h-full w-full rounded border-2 border-dashed"
					:style="{
						borderColor: getRandomColor(collaborator.userId),
						backgroundColor: `${getRandomColor(collaborator.userId)}10`,
					}"
				/>
			</div>
		</template>
	</div>
</template>
