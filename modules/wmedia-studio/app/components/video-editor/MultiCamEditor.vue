<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const cameras = [
	{ id: "A", name: "Camera A", color: "#EF4444", synced: true },
	{ id: "B", name: "Camera B", color: "#3B82F6", synced: true },
	{ id: "C", name: "Camera C", color: "#10B981", synced: true },
	{ id: "D", name: "Camera D", color: "#F59E0B", synced: false },
];

const activeCamera = ref("A");
const timelinePosition = ref(45);
const isSyncing = ref(false);

const onAutoSync = () => {
	isSyncing.value = true;
	setTimeout(() => {
		cameras.forEach(c => c.synced = true);
		isSyncing.value = false;
	}, 2000);
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Multi-Cam Editor"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Auto-sync and switch between multiple camera angles.
			</p>

			<!-- Camera Feeds -->
			<div class="grid grid-cols-2 gap-2">
				<div
					v-for="cam in cameras"
					:key="cam.id"
					class="relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
					:class="activeCamera === cam.id ? 'border-blue-500' : 'border-transparent'"
					@click="activeCamera = cam.id"
				>
					<div class="absolute inset-0 bg-gray-800 flex items-center justify-center">
						<Icon name="mdi:video" class="w-8 h-8 text-gray-600" />
					</div>
					<div
						class="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white"
						:style="{ backgroundColor: cam.color }"
					>
						{{ cam.name }}
					</div>
					<div
						v-if="cam.synced"
						class="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500"
					/>
					<div v-if="activeCamera === cam.id" class="absolute bottom-2 right-2">
						<span class="px-2 py-1 bg-blue-500 text-white text-xs rounded"
						>ACTIVE</span>
					</div>
				</div>
			</div>

			<!-- Sync Status -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Sync Status: {{ cameras.filter(c => c.synced).length }}/{{
							cameras.length
						}} cameras synced
					</span>
					<button
						class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
						:disabled="isSyncing"
						@click="onAutoSync"
					>
						<Icon
							v-if="isSyncing"
							name="mdi:loading"
							class="w-4 h-4 animate-spin inline mr-1"
						/>
						{{ isSyncing ? "Syncing..." : "Auto-Sync by Audio" }}
					</button>
				</div>
			</div>

			<!-- Timeline -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
				<div class="flex items-center gap-2 mb-2">
					<Icon name="mdi:timeline" class="w-4 h-4 text-gray-500" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Switch Timeline</span>
				</div>
				<div class="relative h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
					<div
						v-for="cam in cameras.filter(c => c.synced)"
						:key="cam.id"
						class="absolute top-0 bottom-0 w-1"
						:style="{
							backgroundColor: cam.color,
							left: `${Math.random() * 80 + 10}%`,
						}"
					/>
					<div
						class="absolute top-0 bottom-0 w-0.5 bg-white"
						:style="{ left: `${timelinePosition}%` }"
					>
						<div class="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
					</div>
				</div>
			</div>

			<!-- Switch Buttons -->
			<div class="flex gap-2">
				<button
					v-for="cam in cameras.filter(c => c.synced)"
					:key="cam.id"
					class="flex-1 py-2 rounded-lg text-sm font-medium text-white transition-transform active:scale-95"
					:style="{ backgroundColor: cam.color }"
					@click="activeCamera = cam.id"
				>
					{{ cam.id }}
				</button>
			</div>
		</div>
	</ModalDialog>
</template>
