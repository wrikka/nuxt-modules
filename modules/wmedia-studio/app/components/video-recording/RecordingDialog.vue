<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{
	close: [];
	record: [settings: RecordingSettings];
}>();

interface RecordingSettings {
	resolution: string;
	fps: number;
	audio: boolean;
	countdown: number;
}

const settings = ref<RecordingSettings>({
	resolution: "1920x1080",
	fps: 30,
	audio: true,
	countdown: 3,
});

const resolutions = ["1920x1080", "1280x720", "2560x1440", "3840x2160"];
const fpsOptions = [30, 60];

const startRecording = () => {
	emit("record", settings.value);
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<Icon name="mdi:video" class="w-6 h-6 text-red-500" />
					Recording Settings
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>Resolution</label>
					<select
						v-model="settings.resolution"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
					>
						<option v-for="res in resolutions" :key="res" :value="res">
							{{ res }}
						</option>
					</select>
				</div>

				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>Frame Rate</label>
					<div class="flex gap-2">
						<button
							v-for="fps in fpsOptions"
							:key="fps"
							@click="settings.fps = fps"
							:class="[
								'flex-1 py-2 rounded-lg border',
								settings.fps === fps
									? 'bg-red-500 text-white border-red-500'
									: 'bg-gray-100 dark:bg-gray-700',
							]"
						>
							{{ fps }} FPS
						</button>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Record Audio</label>
					<button
						@click="settings.audio = !settings.audio"
						:class="[
							'w-12 h-6 rounded-full transition-colors',
							settings.audio ? 'bg-green-500' : 'bg-gray-300',
						]"
					>
						<div
							:class="[
								'w-5 h-5 bg-white rounded-full transition-all',
								settings.audio ? 'translate-x-6' : 'translate-x-1',
							]"
						/>
					</button>
				</div>

				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>Countdown: {{ settings.countdown }}s</label>
					<input
						v-model.number="settings.countdown"
						type="range"
						min="0"
						max="10"
						class="w-full"
					/>
				</div>
			</div>

			<button
				@click="startRecording"
				class="w-full mt-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
			>
				<Icon name="mdi:circle" class="w-5 h-5" />
				Start Recording
			</button>
		</div>
	</div>
</template>
