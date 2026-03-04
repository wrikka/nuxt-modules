<script setup lang="ts">
import type { TimelineItem } from "#shared/types";
import { useVideoEditor } from "~/composables/useVideoEditor";
import { useProjectStore } from "~/stores/project";

const projectStore = useProjectStore();
const videoEditor = useVideoEditor();
const { addTransition } = videoEditor;
const {
	currentTime,
	isPlaying,
	selectedItemId,
	selectedTrackId,
	currentProject,
} = storeToRefs(projectStore);

const timelineContent = ref<HTMLElement | null>(null);
const zoomLevel = ref(1);
const pixelsPerSecond = computed(() => 10 * zoomLevel.value);

const totalWidth = computed(() => {
	if (!currentProject.value) return 0;
	return Math.max(
		timelineContent.value?.clientWidth || 0,
		currentProject.value.duration * pixelsPerSecond.value,
	);
});

const timeTicks = computed(() => {
	if (!currentProject.value) return [];

	const duration = currentProject.value.duration;
	const ticks: { time: number; position: number; label: string }[] = [];

	let interval = 1;
	if (zoomLevel.value < 0.5) interval = 10;
	else if (zoomLevel.value < 1) interval = 5;
	else if (zoomLevel.value > 2) interval = 0.5;

	for (let time = 0; time <= duration; time += interval) {
		ticks.push({
			time,
			position: time * pixelsPerSecond.value,
			label: formatTime(time),
		});
	}

	return ticks;
});

const zoomIn = () => {
	zoomLevel.value = Math.min(zoomLevel.value * 1.5, 5);
};

const zoomOut = () => {
	zoomLevel.value = Math.max(zoomLevel.value / 1.5, 0.1);
};

const fitToWindow = () => {
	if (!currentProject.value || !timelineContent.value) return;

	const containerWidth = timelineContent.value.clientWidth;
	const duration = currentProject.value.duration;

	if (duration > 0) {
		zoomLevel.value = containerWidth / (duration * 10);
	}
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const frames = Math.floor((seconds % 1) * 30);
	return `${mins.toString().padStart(2, "0")}:${
		secs.toString().padStart(2, "0")
	}:${frames.toString().padStart(2, "0")}`;
};

const onScroll = (event: Event) => {
	const target = event.target as HTMLElement;
};

const onTrackClick = (trackId: string, event: MouseEvent) => {
	if (event.target === event.currentTarget) {
		projectStore.selectTrack(trackId);
	}
};

const toggleTrackVisibility = (trackId: string) => {
	const track = currentProject.value?.tracks.find((t) => t.id === trackId);
	if (track) {
		track.visible = !track.visible;
	}
};

const toggleTrackLock = (trackId: string) => {
	const track = currentProject.value?.tracks.find((t) => t.id === trackId);
	if (track) {
		track.locked = !track.locked;
	}
};

const getItemsByTrack = (trackId: string): TimelineItem[] => {
	if (!currentProject.value) return [];
	return currentProject.value.timelineItems.filter((item) =>
		item.trackId === trackId
	);
};

const handleItemDrop = (event: DragEvent, itemId: string) => {
	const transitionType = event.dataTransfer?.getData("transitionType");
	if (!transitionType) return;

	const rect = (event.target as HTMLElement).getBoundingClientRect();
	const x = event.clientX - rect.left;
	const width = rect.width;
	const position = x < width / 2 ? "in" : "out";

	addTransition(itemId, transitionType as "fade" | "dissolve", 1.0, position);
};

const splitItem = (itemId: string) => {
	projectStore.selectItem(itemId);
	projectStore.splitItem(itemId, currentTime.value);
};

const getKeyframeTimes = (item: TimelineItem): number[] => {
	if (!item?.transform) return [];
	const times = new Set<number>();
	for (const prop of ["x", "y", "scale", "rotation", "opacity"] as const) {
		const frames = item.transform[prop] as Array<{ time: number }> | undefined;
		if (!frames) continue;
		for (const kf of frames) times.add(kf.time);
	}
	return Array.from(times).sort((a, b) => a - b);
};

// --- Trimming Logic ---
const isTrimming = ref(false);
const trimmingItemId = ref<string | null>(null);
const trimmingEdge = ref<"start" | "end" | null>(null);
const trimInitialX = ref(0);
const trimInitialStartTime = ref(0);
const trimInitialEndTime = ref(0);

const startTrim = (
	itemId: string,
	edge: "start" | "end",
	event: MouseEvent,
) => {
	if (!currentProject.value) return;
	const item = currentProject.value.timelineItems.find(i => i.id === itemId);
	if (!item) return;

	isTrimming.value = true;
	trimmingItemId.value = itemId;
	trimmingEdge.value = edge;
	trimInitialX.value = event.clientX;
	trimInitialStartTime.value = item.startTime;
	trimInitialEndTime.value = item.endTime;

	window.addEventListener("mousemove", handleTrim);
	window.addEventListener("mouseup", stopTrim);
};

const handleTrim = (event: MouseEvent) => {
	if (!isTrimming.value || !trimmingItemId.value || !trimmingEdge.value) return;

	const deltaX = event.clientX - trimInitialX.value;
	const deltaTime = deltaX / pixelsPerSecond.value;

	let newStartTime = trimInitialStartTime.value;
	let newEndTime = trimInitialEndTime.value;

	if (trimmingEdge.value === "start") {
		newStartTime = Math.max(0, trimInitialStartTime.value + deltaTime);
		if (newStartTime >= trimInitialEndTime.value) {
			newStartTime = trimInitialEndTime.value - 0.1; // Prevent crossing over
		}
	} else {
		newEndTime = Math.max(
			trimInitialStartTime.value + 0.1,
			trimInitialEndTime.value + deltaTime,
		);
	}

	projectStore.trimItem(trimmingItemId.value, newStartTime, newEndTime);
};

const stopTrim = () => {
	isTrimming.value = false;
	trimmingItemId.value = null;
	trimmingEdge.value = null;

	window.removeEventListener("mousemove", handleTrim);
	window.removeEventListener("mouseup", stopTrim);
};

watch(currentTime, (newTime) => {
	if (timelineContent.value) {
		const playheadPosition = newTime * pixelsPerSecond.value;
		const scrollLeft = timelineContent.value.scrollLeft;
		const clientWidth = timelineContent.value.clientWidth;

		if (
			playheadPosition < scrollLeft
			|| playheadPosition > scrollLeft + clientWidth
		) {
			timelineContent.value.scrollLeft = playheadPosition - clientWidth / 2;
		}
	}
});
</script>

<template>
	<div class="h-64 bg-gray-800 border-t border-gray-700 flex flex-col">
		<div class="h-8 bg-gray-900 flex items-center justify-between px-4 border-b border-gray-700">
			<span class="text-white text-sm font-medium">Timeline</span>
			<div class="flex items-center gap-2">
				<button
					@click="zoomOut"
					class="text-gray-400 hover:text-white transition-colors"
					title="Zoom out"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
						<path d="M8 11h6" />
					</svg>
				</button>
				<span class="text-gray-400 text-xs">{{
						Math.round(zoomLevel * 100)
					}}%</span>
				<button
					@click="zoomIn"
					class="text-gray-400 hover:text-white transition-colors"
					title="Zoom in"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
						<path d="M8 11h6" />
						<path d="M11 8v6" />
					</svg>
				</button>
			</div>
		</div>

		<div class="flex-1 flex overflow-hidden">
			<div class="w-48 bg-gray-900 border-r border-gray-700 flex flex-col flex-shrink-0">
				<div class="h-8 flex items-center px-2 border-b border-gray-700">
					<span class="text-gray-400 text-xs">Tracks</span>
				</div>
				<div
					v-for="track in currentProject?.tracks || []"
					:key="track.id"
					class="h-12 flex items-center px-2 border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
					:class="{ 'bg-gray-800': selectedTrackId === track.id }"
					@click="projectStore.selectTrack(track.id)"
				>
					<button
						class="mr-2 text-gray-400 hover:text-white transition-colors"
						@click.stop="toggleTrackVisibility(track.id)"
						:title="track.visible ? 'Hide track' : 'Show track'"
					>
						<svg
							v-if="track.visible"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
							<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
							<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
							<line x1="2" x2="22" y1="2" y2="22" />
						</svg>
					</button>
					<button
						class="mr-2 text-gray-400 hover:text-white transition-colors"
						@click.stop="toggleTrackLock(track.id)"
						:title="track.locked ? 'Unlock track' : 'Lock track'"
					>
						<svg
							v-if="track.locked"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 9.9-1" />
						</svg>
					</button>
					<span class="text-white text-sm truncate">{{ track.name }}</span>
				</div>
			</div>

			<div
				ref="timelineContent"
				class="flex-1 flex flex-col overflow-x-auto overflow-y-hidden"
				@scroll="onScroll"
			>
				<div
					class="relative"
					:style="{ width: `${totalWidth}px`, minWidth: '100%' }"
				>
					<div class="h-8 bg-gray-900 flex items-center border-b border-gray-700 relative">
						<div
							v-for="tick in timeTicks"
							:key="tick.time"
							class="absolute text-gray-500 text-xs"
							:style="{ left: `${tick.position}px` }"
						>
							{{ tick.label }}
						</div>
						<div
							class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
							:style="{ left: `${currentTime * pixelsPerSecond}px` }"
						>
							<div class="absolute -top-1 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
						</div>
					</div>

					<div
						v-for="track in currentProject?.tracks || []"
						:key="track.id"
						class="h-12 relative border-b border-gray-700"
						:class="{ 'opacity-50': !track.visible }"
						@click="onTrackClick(track.id, $event)"
					>
						<div
							v-for="item in getItemsByTrack(track.id)"
							:key="item.id"
							class="absolute top-1 bottom-1 rounded border-2 flex items-center px-2 overflow-hidden group"
							:class="{
								'bg-blue-600 border-blue-400': item.type === 'video',
								'bg-green-600 border-green-400': item.type === 'audio',
								'bg-purple-600 border-purple-400': item.type === 'text',
								'bg-yellow-600 border-yellow-400': item.type === 'image',
								'bg-pink-600 border-pink-400': item.type === 'design-element',
								'border-white': selectedItemId === item.id,
								'cursor-pointer': !isTrimming,
								'cursor-ew-resize': isTrimming,
							}"
							:style="{
								left: `${item.startTime * pixelsPerSecond}px`,
								width: `${item.duration * pixelsPerSecond}px`,
							}"
							@click.stop="projectStore.selectItem(item.id)"
							@dblclick.stop="splitItem(item.id)"
							@drop.prevent="handleItemDrop($event, item.id)"
							@dragover.prevent
						>
							<!-- Transition Indicators -->
							<div
								v-if="item.transitionIn"
								class="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-transparent to-white opacity-30"
								:style="{
									width: `${
										Math.min(
											item.transitionIn.duration * pixelsPerSecond,
											item.duration * pixelsPerSecond / 2,
										)
									}px`,
								}"
								:title="`Fade In: ${item.transitionIn.duration}s`"
							/>
							<div
								v-if="item.transitionOut"
								class="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-transparent to-white opacity-30"
								:style="{
									width: `${
										Math.min(
											item.transitionOut.duration * pixelsPerSecond,
											item.duration * pixelsPerSecond / 2,
										)
									}px`,
								}"
								:title="`Fade Out: ${item.transitionOut.duration}s`"
							/>
							<div
								v-if="selectedItemId === item.id"
								class="absolute left-0 top-0 bottom-0 w-2 bg-white opacity-50 cursor-ew-resize"
								@mousedown.stop="startTrim(item.id, 'start', $event)"
							/>
							<!-- Keyframe Markers -->
							<div
								v-if="selectedItemId === item.id && item.transform"
								class="absolute left-0 right-0 top-0 bottom-0 pointer-events-none"
							>
								<div
									v-for="t in getKeyframeTimes(item)"
									:key="t"
									class="absolute top-1/2 w-2 h-2 bg-white rotate-45 opacity-80"
									:style="{
										left: `${t * pixelsPerSecond - 1}px`,
										transform: 'translateY(-50%) rotate(45deg)',
									}"
								/>
							</div>
							<span class="text-white text-xs truncate pointer-events-none">{{
								item.name
							}}</span>
							<div
								v-if="selectedItemId === item.id"
								class="absolute right-0 top-0 bottom-0 w-2 bg-white opacity-50 cursor-ew-resize"
								@mousedown.stop="startTrim(item.id, 'end', $event)"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="h-8 bg-gray-900 flex items-center justify-between px-4 border-t border-gray-700">
			<div class="flex items-center gap-2">
				<span class="text-white text-sm font-mono">{{
					formatTime(currentTime)
				}}</span>
				<span class="text-gray-500 text-sm">/</span>
				<span class="text-gray-400 text-sm font-mono">{{
					formatTime(currentProject?.duration || 0)
				}}</span>
			</div>
			<div class="flex items-center gap-2">
				<button
					@click="fitToWindow"
					class="text-gray-400 hover:text-white text-xs transition-colors"
					title="Fit to window"
				>
					Fit
				</button>
			</div>
		</div>
	</div>
</template>
