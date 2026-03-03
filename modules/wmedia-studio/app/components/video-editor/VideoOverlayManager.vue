<script setup lang="ts">
const emit = defineEmits<{ close: []; add: [type: string]; reorder: [] }>();
const overlays = ref([{ id: "1", type: "text", name: "Title", visible: true }, {
	id: "2",
	type: "image",
	name: "Logo",
	visible: true,
}, { id: "3", type: "shape", name: "Rectangle", visible: false }]);
const selectedOverlay = ref<string | null>(null);

const overlayTypes = [
	{ id: "text", name: "Text", icon: "i-ph-text-t" },
	{ id: "image", name: "Image", icon: "i-ph-image" },
	{ id: "shape", name: "Shape", icon: "i-ph-shapes" },
	{ id: "video", name: "Video", icon: "i-ph-film-strip" },
	{ id: "gradient", name: "Gradient", icon: "i-ph-gradient" },
];

const toggleVisibility = (id: string) => {
	const o = overlays.value.find(x => x.id === id);
	if (o) o.visible = !o.visible;
};

const moveUp = (index: number) => {
	if (index > 0) {
		const temp = overlays.value[index]!;
		overlays.value[index] = overlays.value[index - 1]!;
		overlays.value[index - 1] = temp;
	}
};

const moveDown = (index: number) => {
	if (index < overlays.value.length - 1) {
		const temp = overlays.value[index]!;
		overlays.value[index] = overlays.value[index + 1]!;
		overlays.value[index + 1] = temp;
	}
};
</script>

<template>
	<div class="video-overlay-manager bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:layers" class="w-5 h-5 text-blue-500" />
				Video Overlays
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<button
				v-for="t in overlayTypes"
				:key="t.id"
				class="flex-1 p-2 rounded-lg text-center transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
				@click="emit('add', t.id)"
			>
				<span
					:class="[t.icon, 'w-5 h-5 mx-auto mb-1 text-gray-500 dark:text-gray-400']"
				/>
				<div class="text-gray-700 dark:text-gray-300 text-xs">{{ t.name }}</div>
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-2">
			<div
				v-for="(o, i) in overlays"
				:key="o.id"
				class="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all"
				:class="selectedOverlay === o.id
				? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
				: 'bg-gray-50 dark:bg-gray-700/30'"
				@click="selectedOverlay = o.id"
			>
				<button
					class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
					@click.stop="toggleVisibility(o.id)"
				>
					<Icon :name="o.visible ? 'mdi:eye' : 'mdi:eye-off'" class="w-4 h-4" />
				</button>
				<span
					:class="[
						overlayTypes.find(t => t.id === o.type)?.icon || 'mdi:square',
						'w-4 h-4 text-gray-500 dark:text-gray-400',
					]"
				/>
				<span class="flex-1 text-gray-900 dark:text-white text-sm">{{
					o.name
				}}</span>
				<div class="flex gap-1">
					<button
						class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
						:disabled="i === 0"
						@click.stop="moveUp(i)"
					>
						<Icon name="mdi:chevron-up" class="w-4 h-4" />
					</button>
					<button
						class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
						:disabled="i === overlays.length - 1"
						@click.stop="moveDown(i)"
					>
						<Icon name="mdi:chevron-down" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
