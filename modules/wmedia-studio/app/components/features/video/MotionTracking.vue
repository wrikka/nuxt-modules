<script setup lang="ts">
interface TrackingPoint {
	id: string;
	x: number;
	y: number;
	frame: number;
	confidence: number;
}

interface TrackedObject {
	id: string;
	name: string;
	type: "point" | "area" | "person" | "object";
	color: string;
	points: TrackingPoint[];
	isActive: boolean;
	attachments: string[];
}

interface Attachment {
	id: string;
	name: string;
	type: "text" | "image" | "video" | "shape";
	content: string;
	offsetX: number;
	offsetY: number;
}

const isTracking = ref(false);
const selectedObject = ref<TrackedObject | null>(null);
const showTrackingPanel = ref(false);
const trackingMode = ref<"manual" | "auto">("auto");
const currentFrame = ref(0);
const totalFrames = ref(300);

const trackedObjects = ref<TrackedObject[]>([
	{
		id: "1",
		name: "Ball",
		type: "object",
		color: "#FF5733",
		isActive: true,
		points: [
			{ id: "p1", x: 320, y: 240, frame: 0, confidence: 0.95 },
			{ id: "p2", x: 340, y: 260, frame: 30, confidence: 0.92 },
			{ id: "p3", x: 360, y: 280, frame: 60, confidence: 0.88 },
		],
		attachments: ["text1"],
	},
	{
		id: "2",
		name: "Person - Face",
		type: "person",
		color: "#33FF57",
		isActive: false,
		points: [
			{ id: "p4", x: 450, y: 200, frame: 0, confidence: 0.98 },
		],
		attachments: [],
	},
]);

const attachments = ref<Attachment[]>([
	{
		id: "text1",
		name: "Score Text",
		type: "text",
		content: "GOAL!",
		offsetX: 20,
		offsetY: -30,
	},
]);

const availableAttachments: Attachment[] = [
	{
		id: "new-text",
		name: "Text Label",
		type: "text",
		content: "New Text",
		offsetX: 0,
		offsetY: 0,
	},
	{
		id: "new-img",
		name: "Image Overlay",
		type: "image",
		content: "/overlay.png",
		offsetX: 0,
		offsetY: 0,
	},
	{
		id: "new-shape",
		name: "Shape",
		type: "shape",
		content: "circle",
		offsetX: 0,
		offsetY: 0,
	},
];

function startTracking() {
	isTracking.value = true;
	// Simulate tracking process
	setTimeout(() => {
		isTracking.value = false;
		showTrackingPanel.value = true;
	}, 2000);
}

function selectObject(obj: TrackedObject) {
	selectedObject.value = obj;
	trackedObjects.value.forEach(o => o.isActive = o.id === obj.id);
}

function addAttachment(attachment: Attachment) {
	if (selectedObject.value) {
		selectedObject.value.attachments.push(attachment.id);
	}
}

function removeAttachment(attachmentId: string) {
	if (selectedObject.value) {
		const index = selectedObject.value.attachments.indexOf(attachmentId);
		if (index > -1) {
			selectedObject.value.attachments.splice(index, 1);
		}
	}
}

function getObjectPosition(obj: TrackedObject, frame: number) {
	// Interpolate position based on frame
	const point = obj.points.find(p => p.frame >= frame)
		|| obj.points[obj.points.length - 1];
	return { x: point?.x || 0, y: point?.y || 0 };
}

function seekToFrame(frame: number) {
	currentFrame.value = Math.max(0, Math.min(frame, totalFrames.value));
}
</script>

<template>
	<div class="motion-tracking">
		<h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
			<Icon name="mdi:target" class="w-6 h-6" />
			Motion Tracking
		</h2>
		<p class="text-gray-500 mb-6">
			Track objects and attach text/graphics that follow
		</p>

		<!-- Video Preview with Tracking Overlay -->
		<div class="preview-section relative mb-6">
			<div class="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
				<!-- Video Frame Placeholder -->
				<div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
					<Icon name="mdi:video" class="w-12 h-12 text-gray-600 block" />
				</div>

				<!-- Tracking Overlays -->
				<div
					v-for="obj in trackedObjects.filter(o => o.isActive)"
					:key="obj.id"
					class="tracking-overlay absolute"
					:style="{
						left: `${getObjectPosition(obj, currentFrame).x}px`,
						top: `${getObjectPosition(obj, currentFrame).y}px`,
						transform: 'translate(-50%, -50%)',
					}"
				>
					<!-- Tracking Box -->
					<div
						class="w-16 h-16 border-2 rounded"
						:style="{ borderColor: obj.color }"
					>
						<div
							class="absolute -top-6 left-0 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap"
							:style="{ backgroundColor: obj.color }"
						>
							{{ obj.name }}
						</div>
					</div>

					<!-- Attached Elements -->
					<div
						v-for="attId in obj.attachments"
						:key="attId"
						class="attached-element absolute bg-white px-2 py-1 rounded shadow-lg text-sm"
					>
						{{ attachments.find(a => a.id === attId)?.content }}
					</div>
				</div>

				<!-- Add New Tracker Button -->
				<button
					@click="showTrackingPanel = true"
					class="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
				>
					<Icon name="mdi:plus" class="w-4 h-4 mr-1" />
					Add Tracker
				</button>
			</div>

			<!-- Timeline Scrubber -->
			<div class="mt-4 bg-gray-100 rounded-lg p-4">
				<div class="flex items-center gap-4">
					<button
						@click="seekToFrame(currentFrame - 30)"
						class="p-2 hover:bg-gray-200 rounded"
					>
						<Icon name="mdi:skip-backward" class="w-5 h-5" />
					</button>
					<button
						@click="isTracking ? isTracking = false : startTracking()"
						class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						<Icon
							:name="isTracking ? 'mdi:stop' : 'mdi:play'"
							class="w-5 h-5"
						/>
					</button>
					<button
						@click="seekToFrame(currentFrame + 30)"
						class="p-2 hover:bg-gray-200 rounded"
					>
						<Icon name="mdi:skip-forward" class="w-5 h-5" />
					</button>

					<div class="flex-1">
						<input
							v-model="currentFrame"
							type="range"
							min="0"
							:max="totalFrames"
							class="w-full"
						/>
						<div class="flex justify-between text-xs text-gray-500 mt-1">
							<span>0:00</span>
							<span>{{ Math.floor(currentFrame / 30) }}:{{
									String(currentFrame % 30).padStart(2, "0")
								}}</span>
							<span>{{ Math.floor(totalFrames / 30) }}:00</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Tracking Control Panel -->
		<div
			v-if="showTrackingPanel"
			class="tracking-panel bg-gray-50 rounded-lg p-4"
		>
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-semibold">Tracking Objects</h3>
				<div class="flex gap-2">
					<button
						@click="trackingMode = 'auto'"
						class="px-3 py-1 text-sm rounded flex items-center"
						:class="trackingMode === 'auto' ? 'bg-blue-600 text-white' : 'border'"
					>
						<Icon name="mdi:magic-staff" class="w-4 h-4 mr-1" />
						Auto Track
					</button>
					<button
						@click="trackingMode = 'manual'"
						class="px-3 py-1 text-sm rounded flex items-center"
						:class="trackingMode === 'manual' ? 'bg-blue-600 text-white' : 'border'"
					>
						<Icon name="mdi:cursor-pointer" class="w-4 h-4 mr-1" />
						Manual
					</button>
				</div>
			</div>

			<!-- Object List -->
			<div class="grid grid-cols-2 gap-4 mb-4">
				<div class="space-y-2">
					<h4 class="text-sm font-medium text-gray-500">Tracked Objects</h4>
					<div
						v-for="obj in trackedObjects"
						:key="obj.id"
						class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer"
						:class="{ 'ring-2 ring-blue-500': selectedObject?.id === obj.id }"
						@click="selectObject(obj)"
					>
						<div
							class="w-4 h-4 rounded"
							:style="{ backgroundColor: obj.color }"
						/>
						<div class="flex-1">
							<div class="font-medium">{{ obj.name }}</div>
							<div class="text-xs text-gray-500">
								{{ obj.points.length }} keyframes
							</div>
						</div>
						<Icon
							v-if="obj.isActive"
							name="mdi:eye"
							class="w-4 h-4 text-blue-500"
						/>
					</div>
				</div>

				<!-- Attachments Panel -->
				<div v-if="selectedObject" class="space-y-2">
					<h4 class="text-sm font-medium text-gray-500">Attached Elements</h4>
					<div
						v-if="selectedObject.attachments.length === 0"
						class="text-sm text-gray-400 italic"
					>
						No attachments yet
					</div>
					<div
						v-for="attId in selectedObject.attachments"
						:key="attId"
						class="flex items-center gap-2 p-2 bg-white border rounded"
					>
						<Icon name="mdi:format-text" class="w-4 h-4" />
						<span class="flex-1">{{
							attachments.find(a => a.id === attId)?.name
						}}</span>
						<button
							@click="removeAttachment(attId)"
							class="text-red-500 hover:text-red-700"
						>
							<Icon name="mdi:close" class="w-4 h-4" />
						</button>
					</div>

					<div class="mt-4">
						<p class="text-xs text-gray-500 mb-2">Add new attachment:</p>
						<div class="flex gap-2">
							<button
								v-for="att in availableAttachments"
								:key="att.id"
								@click="addAttachment(att)"
								class="px-3 py-1 text-xs border rounded hover:bg-gray-50"
							>
								<Icon
									:name="att.type === 'text'
									? 'mdi:format-text'
									: att.type === 'image'
									? 'mdi:image'
									: 'mdi:shape'"
									class="w-3 h-3 mr-1"
								/>
								{{ att.name }}
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Tracking Settings -->
			<div class="bg-white rounded-lg p-4">
				<h4 class="font-medium mb-3">Tracking Settings</h4>
				<div class="grid grid-cols-3 gap-4">
					<div>
						<label class="block text-xs mb-1">Tracking Quality</label>
						<select class="w-full border rounded px-2 py-1 text-sm">
							<option>High (slower)</option>
							<option selected>Balanced</option>
							<option>Fast (lower accuracy)</option>
						</select>
					</div>
					<div>
						<label class="block text-xs mb-1">Search Radius</label>
						<input type="range" min="10" max="100" value="50" class="w-full" />
					</div>
					<div>
						<label class="block text-xs mb-1">Minimum Confidence</label>
						<input
							type="range"
							min="0.5"
							max="1"
							step="0.05"
							value="0.8"
							class="w-full"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.motion-tracking {
	padding: 1.5rem;
}

.tracking-overlay {
	pointer-events: none;
}

.attached-element {
	top: -40px;
	left: 20px;
}
</style>
