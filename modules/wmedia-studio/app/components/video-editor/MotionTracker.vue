<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const isTracking = ref(false);
const selectedObject = ref<string | null>(null);
const trackingData = ref({
	x: 150,
	y: 200,
	width: 80,
	height: 60,
});

const objects = [
	{ id: "1", name: "Face 1", type: "face", confidence: 94 },
	{ id: "2", name: "Car", type: "object", confidence: 87 },
	{ id: "3", name: "Person", type: "person", confidence: 91 },
];

const attachments = [
	{ id: "1", name: "Text Overlay", type: "text" },
	{ id: "2", name: "Blur Effect", type: "blur" },
	{ id: "3", name: "Mosaic", type: "mosaic" },
];

const onStartTracking = () => {
	isTracking.value = true;
};

const onStopTracking = () => {
	isTracking.value = false;
};

const attachEffect = (attachmentId: string) => {
	console.log("Attach", attachmentId, "to", selectedObject.value);
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Motion Tracker"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<!-- Preview -->
			<div class="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
				<div class="absolute inset-0 flex items-center justify-center text-gray-500">
					<Icon name="mdi:video" class="w-12 h-12" />
				</div>
				<!-- Tracking box -->
				<div
					class="absolute border-2 border-blue-500 bg-blue-500/20"
					:style="{
						left: `${trackingData.x}px`,
						top: `${trackingData.y}px`,
						width: `${trackingData.width}px`,
						height: `${trackingData.height}px`,
					}"
				>
					<div class="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
						Tracking
					</div>
					<div class="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize" />
				</div>
			</div>

			<!-- Controls -->
			<div class="flex gap-3">
				<button
					class="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
					:class="isTracking
					? 'bg-red-500 hover:bg-red-600 text-white'
					: 'bg-blue-500 hover:bg-blue-600 text-white'"
					@click="isTracking ? onStopTracking() : onStartTracking()"
				>
					<Icon :name="isTracking ? 'mdi:stop' : 'mdi:play'" class="w-5 h-5" />
					{{ isTracking ? "Stop Tracking" : "Start Tracking" }}
				</button>
				<button class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200">
					<Icon name="mdi:refresh" class="w-5 h-5" />
				</button>
			</div>

			<!-- Detected Objects -->
			<div>
				<h4 class="font-medium text-gray-900 dark:text-white mb-2">
					Auto-Detected Objects
				</h4>
				<div class="space-y-2">
					<button
						v-for="obj in objects"
						:key="obj.id"
						class="w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors"
						:class="selectedObject === obj.id
						? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-500'
						: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'"
						@click="selectedObject = obj.id"
					>
						<div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
							<Icon
								:name="obj.type === 'face'
								? 'mdi:face'
								: obj.type === 'person'
								? 'mdi:account'
								: 'mdi:cube'"
								class="w-5 h-5 text-gray-500"
							/>
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-900 dark:text-white">
								{{ obj.name }}
							</p>
							<p class="text-xs text-gray-500">
								{{ obj.confidence }}% confidence
							</p>
						</div>
						<div
							class="w-3 h-3 rounded-full"
							:class="selectedObject === obj.id ? 'bg-blue-500' : 'bg-gray-300'"
						/>
					</button>
				</div>
			</div>

			<!-- Attachments -->
			<div v-if="selectedObject">
				<h4 class="font-medium text-gray-900 dark:text-white mb-2">
					Attach Effect
				</h4>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="att in attachments"
						:key="att.id"
						class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-center hover:bg-gray-200 transition-colors"
						@click="attachEffect(att.id)"
					>
						<Icon
							:name="att.type === 'text'
							? 'mdi:format-text'
							: att.type === 'blur'
							? 'mdi:blur'
							: 'mdi:grid'"
							class="w-5 h-5 mx-auto mb-1 text-gray-600"
						/>
						<p class="text-xs text-gray-700 dark:text-gray-300">
							{{ att.name }}
						</p>
					</button>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
