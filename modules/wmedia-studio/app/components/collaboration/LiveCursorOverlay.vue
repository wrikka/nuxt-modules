<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
}>();

// Mock data for live cursors
const mockUsers = [
	{ id: "1", name: "Alice", color: "#FF6B6B", x: 200, y: 150 },
	{ id: "2", name: "Bob", color: "#4ECDC4", x: 400, y: 300 },
	{ id: "3", name: "Carol", color: "#45B7D1", x: 600, y: 200 },
];

const userCursors = ref(mockUsers);

const settings = reactive({
	showCursors: true,
	showUserNames: true,
	showSelectionHighlights: true,
	followMode: false,
});
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Live Collaboration"
		@close="emit('close')"
	>
		<div class="space-y-6">
			<!-- Preview Area -->
			<div class="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
				<div class="absolute inset-0 flex items-center justify-center text-gray-400">
					<Icon name="mdi:account-group" class="w-12 h-12" />
					<span class="ml-2">Canvas Preview with Live Cursors</span>
				</div>
				<!-- Mock cursors -->
				<div
					v-for="user in userCursors"
					:key="user.id"
					class="absolute transition-all duration-300"
					:style="{ left: `${user.x}px`, top: `${user.y}px` }"
				>
					<Icon
						name="mdi:cursor-pointer"
						class="w-5 h-5"
						:style="{ color: user.color }"
					/>
					<span
						v-if="settings.showUserNames"
						class="ml-5 text-xs px-2 py-1 rounded text-white"
						:style="{ backgroundColor: user.color }"
					>
						{{ user.name }}
					</span>
				</div>
			</div>

			<!-- Settings -->
			<div class="space-y-3">
				<h4 class="font-medium text-gray-900 dark:text-white">
					Cursor Settings
				</h4>
				<label class="flex items-center gap-3">
					<input
						v-model="settings.showCursors"
						type="checkbox"
						class="rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Show collaborator cursors</span>
				</label>
				<label class="flex items-center gap-3">
					<input
						v-model="settings.showUserNames"
						type="checkbox"
						class="rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Show user names</span>
				</label>
				<label class="flex items-center gap-3">
					<input
						v-model="settings.showSelectionHighlights"
						type="checkbox"
						class="rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Highlight selections</span>
				</label>
				<label class="flex items-center gap-3">
					<input
						v-model="settings.followMode"
						type="checkbox"
						class="rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Follow collaborator view</span>
				</label>
			</div>

			<!-- Active Users -->
			<div>
				<h4 class="font-medium text-gray-900 dark:text-white mb-3">
					Active Users ({{ userCursors.length }})
				</h4>
				<div class="flex flex-wrap gap-2">
					<div
						v-for="user in userCursors"
						:key="user.id"
						class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
					>
						<div
							class="w-3 h-3 rounded-full"
							:style="{ backgroundColor: user.color }"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300">{{
							user.name
						}}</span>
					</div>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
