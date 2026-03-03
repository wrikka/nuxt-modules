<script setup lang="ts">
import type { AudioClip, ClipGroup } from "#shared/types/audio";
import { nanoid } from "nanoid";

const props = defineProps<{
	clips: AudioClip[];
	groups: ClipGroup[];
}>();

const emit = defineEmits<{
	createGroup: [group: ClipGroup];
	updateGroup: [groupId: string, updates: Partial<ClipGroup>];
	deleteGroup: [groupId: string];
	moveToGroup: [clipId: string, groupId: string | null];
}>();

const newGroupName = ref("");
const selectedColor = ref("#3b82f6");
const expandedGroups = ref<Set<string>>(new Set());
const editingGroup = ref<string | null>(null);
const editName = ref("");

const colorOptions = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#84cc16",
	"#22c55e",
	"#14b8a6",
	"#06b6d4",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#f43f5e",
	"#78716c",
];

const createGroup = () => {
	if (!newGroupName.value.trim()) return;

	const group: ClipGroup = {
		id: nanoid(),
		name: newGroupName.value,
		color: selectedColor.value,
		clipIds: [],
		collapsed: false,
	};

	emit("createGroup", group);
	newGroupName.value = "";
};

const toggleGroup = (groupId: string) => {
	const group = props.groups.find(g => g.id === groupId);
	if (group) {
		emit("updateGroup", groupId, { collapsed: !group.collapsed });
	}
};

const deleteGroup = (groupId: string) => {
	emit("deleteGroup", groupId);
};

const startEdit = (group: ClipGroup) => {
	editingGroup.value = group.id;
	editName.value = group.name;
};

const saveEdit = (groupId: string) => {
	if (editName.value.trim()) {
		emit("updateGroup", groupId, { name: editName.value });
	}
	editingGroup.value = null;
};

const getUngroupedClips = computed(() => {
	const groupedClipIds = new Set(props.groups.flatMap(g => g.clipIds));
	return props.clips.filter(c => !groupedClipIds.has(c.id));
});

const getGroupClips = (group: ClipGroup) => {
	return props.clips.filter(c => group.clipIds.includes(c.id));
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Clip Groups</span>
			<span class="text-xs text-gray-500">{{ groups.length }} groups</span>
		</div>

		<!-- Create Group -->
		<div class="mb-4 space-y-2">
			<input
				v-model="newGroupName"
				placeholder="New group name..."
				class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
				@keyup.enter="createGroup"
			>
			<div class="flex items-center gap-2">
				<div class="flex flex-wrap gap-1 flex-1">
					<button
						v-for="color in colorOptions"
						:key="color"
						@click="selectedColor = color"
						:class="[
							'w-5 h-5 rounded transition-transform',
							selectedColor === color
								? 'ring-2 ring-white scale-110'
								: 'hover:scale-105',
						]"
						:style="{ backgroundColor: color }"
					/>
				</div>
				<button
					@click="createGroup"
					:disabled="!newGroupName.trim()"
					class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
				>
					Create
				</button>
			</div>
		</div>

		<!-- Groups List -->
		<div class="space-y-2">
			<div
				v-for="group in groups"
				:key="group.id"
				class="bg-gray-800 rounded overflow-hidden"
			>
				<!-- Group Header -->
				<div
					class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-700 transition-colors"
					@click="toggleGroup(group.id)"
				>
					<svg
						class="w-4 h-4 text-gray-400 transition-transform"
						:class="group.collapsed ? '' : 'rotate-90'"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
					<div
						class="w-3 h-3 rounded"
						:style="{ backgroundColor: group.color }"
					/>
					<div v-if="editingGroup === group.id" class="flex-1">
						<input
							v-model="editName"
							class="w-full bg-gray-900 text-white rounded px-2 py-0.5 text-sm"
							@blur="saveEdit(group.id)"
							@keyup.enter="saveEdit(group.id)"
							@keyup.escape="editingGroup = null"
							v-focus
						>
					</div>
					<span v-else class="flex-1 text-sm text-gray-300">{{
						group.name
					}}</span>
					<span class="text-xs text-gray-500">{{ group.clipIds.length }}</span>
					<button
						@click.stop="startEdit(group)"
						class="p-1 text-gray-400 hover:text-white"
					>
						<svg
							class="w-3 h-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
					</button>
					<button
						@click.stop="deleteGroup(group.id)"
						class="p-1 text-gray-400 hover:text-red-400"
					>
						<svg
							class="w-3 h-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>

				<!-- Group Clips -->
				<div v-if="!group.collapsed" class="px-4 py-2 space-y-1">
					<div
						v-for="clip in getGroupClips(group)"
						:key="clip.id"
						class="text-xs text-gray-400 truncate"
					>
						{{ clip.name }}
					</div>
					<div
						v-if="group.clipIds.length === 0"
						class="text-xs text-gray-500 italic"
					>
						No clips in this group
					</div>
				</div>
			</div>
		</div>

		<!-- Ungrouped Clips -->
		<div v-if="getUngroupedClips.length > 0" class="mt-4">
			<div class="text-xs text-gray-400 mb-2">
				Ungrouped Clips ({{ getUngroupedClips.length }})
			</div>
			<div class="space-y-1">
				<div
					v-for="clip in getUngroupedClips"
					:key="clip.id"
					class="text-xs text-gray-500 truncate"
				>
					{{ clip.name }}
				</div>
			</div>
		</div>
	</div>
</template>
