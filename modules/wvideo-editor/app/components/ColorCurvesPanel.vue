<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
}>();

const channels = ["Master", "Red", "Green", "Blue"] as const;
type Channel = typeof channels[number];
const selectedChannel = ref<Channel>("Master");

const curves = reactive({
	Master: [{ x: 0, y: 0 }, { x: 64, y: 48 }, { x: 128, y: 128 }, {
		x: 192,
		y: 208,
	}, { x: 255, y: 255 }],
	Red: [{ x: 0, y: 0 }, { x: 128, y: 135 }, { x: 255, y: 255 }],
	Green: [{ x: 0, y: 0 }, { x: 128, y: 125 }, { x: 255, y: 255 }],
	Blue: [{ x: 0, y: 0 }, { x: 128, y: 120 }, { x: 255, y: 255 }],
});

const presets = [
	{ name: "S-Curve", icon: "mdi:chart-bell-curve" },
	{ name: "High Contrast", icon: "mdi:contrast-box" },
	{ name: "Fade", icon: "mdi:gradient" },
	{ name: "Vintage", icon: "mdi:history" },
];
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Color Grading Curves"
		@close="emit('close')"
	>
		<div class="space-y-4">
			<!-- Channel Selector -->
			<div class="flex gap-2">
				<button
					v-for="channel in channels"
					:key="channel"
					class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
					:class="selectedChannel === channel
					? 'bg-blue-500 text-white'
					: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'"
					@click="selectedChannel = channel"
				>
					<span
						class="inline-block w-2 h-2 rounded-full mr-1"
						:class="{
							'bg-gray-500': channel === 'Master',
							'bg-red-500': channel === 'Red',
							'bg-green-500': channel === 'Green',
							'bg-blue-500': channel === 'Blue',
						}"
					/>
					{{ channel }}
				</button>
			</div>

			<!-- Curve Editor -->
			<div class="bg-gray-900 rounded-lg p-4 aspect-square relative">
				<svg viewBox="0 0 256 256" class="w-full h-full">
					<!-- Grid -->
					<defs>
						<pattern
							id="grid"
							width="32"
							height="32"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 32 0 L 0 0 0 32"
								fill="none"
								stroke="#333"
								stroke-width="0.5"
							/>
						</pattern>
					</defs>
					<rect width="256" height="256" fill="url(#grid)" />
					<!-- Diagonal reference -->
					<line
						x1="0"
						y1="256"
						x2="256"
						y2="0"
						stroke="#444"
						stroke-width="1"
						stroke-dasharray="4"
					/>
					<!-- Curve -->
					<polyline
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-blue-500"
						:points="curves[selectedChannel].map(p => `${p.x},${256 - p.y}`).join(' ')"
					/>
					<!-- Control points -->
					<circle
						v-for="(point, i) in curves[selectedChannel]"
						:key="i"
						:cx="point.x"
						:cy="256 - point.y"
						r="4"
						fill="#3B82F6"
						stroke="white"
						stroke-width="1"
					/>
				</svg>
				<!-- Axis labels -->
				<span class="absolute bottom-2 left-2 text-xs text-gray-500"
				>Shadows</span>
				<span class="absolute bottom-2 right-2 text-xs text-gray-500"
				>Highlights</span>
				<span class="absolute top-2 left-2 text-xs text-gray-500">Output</span>
			</div>

			<!-- Presets -->
			<div class="flex gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
				>
					<Icon :name="preset.icon" class="w-4 h-4" />
					{{ preset.name }}
				</button>
			</div>
		</div>
	</ModalDialog>
</template>
