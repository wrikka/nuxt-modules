<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const isActive = ref(false);
const script = ref(
	`Welcome to today's video!\n\nIn this tutorial, we'll cover:\n- Setting up your workspace\n- Key features and shortcuts\n- Best practices for efficiency\n\nLet's get started!`,
);

const settings = reactive({
	speed: 1.0,
	fontSize: 24,
	mirrorText: false,
	scrollSpeed: "auto",
});

const scrollPosition = ref(0);

const toggleTeleprompter = () => {
	isActive.value = !isActive.value;
};

const lines = computed(() => script.value.split("\n"));
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="AI Script Teleprompter"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Auto-scroll script synced to your recording for smooth delivery.
			</p>

			<!-- Script Editor -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
				>Script</label>
				<textarea
					v-model="script"
					rows="4"
					class="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 font-mono"
				/>
			</div>

			<!-- Teleprompter Display -->
			<div class="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
				<div class="absolute inset-0 flex flex-col items-center justify-center px-8">
					<div
						v-for="(line, i) in lines"
						:key="i"
						class="text-white text-center transition-all"
						:style="{
							fontSize: `${settings.fontSize}px`,
							opacity: i === Math.floor(scrollPosition) ? 1 : 0.3,
							transform: `scale(${i === Math.floor(scrollPosition) ? 1.1 : 1})`,
						}"
					>
						{{ line }}
					</div>
				</div>
				<!-- Progress -->
				<div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
					<div
						class="h-full bg-blue-500"
						:style="{ width: `${(scrollPosition / lines.length) * 100}%` }"
					/>
				</div>
			</div>

			<!-- Settings -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Scroll Speed: {{ settings.speed }}x
					</label>
					<input
						v-model="settings.speed"
						type="range"
						min="0.5"
						max="3"
						step="0.1"
						class="w-full"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Font Size: {{ settings.fontSize }}px
					</label>
					<input
						v-model="settings.fontSize"
						type="range"
						min="16"
						max="48"
						class="w-full"
					/>
				</div>
			</div>

			<div class="flex items-center gap-4">
				<label class="flex items-center gap-2">
					<input
						v-model="settings.mirrorText"
						type="checkbox"
						class="rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Mirror text (for reflecting glass)</span>
				</label>
			</div>

			<!-- Controls -->
			<div class="flex gap-3">
				<button
					class="flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
					:class="isActive
					? 'bg-red-500 hover:bg-red-600 text-white'
					: 'bg-green-500 hover:bg-green-600 text-white'"
					@click="toggleTeleprompter"
				>
					<Icon :name="isActive ? 'mdi:pause' : 'mdi:play'" class="w-5 h-5" />
					{{ isActive ? "Pause" : "Start" }} Teleprompter
				</button>
				<button class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200">
					<Icon name="mdi:refresh" class="w-5 h-5" />
				</button>
			</div>
		</div>
	</ModalDialog>
</template>
