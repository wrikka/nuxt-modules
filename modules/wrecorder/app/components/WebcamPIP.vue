<script setup lang="ts">
const props = defineProps<{
	containerRef?: HTMLElement | null;
}>();

const emit = defineEmits<{
	(e: "pip-change", active: boolean): void;
}>();

const { state, webcamVideo, containerRef: pipContainerRef, containerStyle, videoStyle, activate, deactivate, toggle, setPosition, startDrag, resize } = usePictureInPicture({
	position: "bottom-right",
	width: 200,
	height: 150,
	borderRadius: 12,
	border: true,
	borderColor: "#ffffff",
	shadow: true,
});

const positions = [
	{ id: "top-left", name: "Top Left", icon: "mdi:arrow-top-left" },
	{ id: "top-right", name: "Top Right", icon: "mdi:arrow-top-right" },
	{ id: "bottom-left", name: "Bottom Left", icon: "mdi:arrow-bottom-left" },
	{ id: "bottom-right", name: "Bottom Right", icon: "mdi:arrow-bottom-right" },
];

const sizes = [
	{ id: "small", name: "Small", width: 160, height: 120 },
	{ id: "medium", name: "Medium", width: 200, height: 150 },
	{ id: "large", name: "Large", width: 280, height: 210 },
];

const selectedSize = ref("medium");

const handleToggle = async () => {
	if (state.isActive) {
		deactivate();
	} else {
		await activate();
	}
	emit("pip-change", state.isActive);
};

const handlePositionChange = (pos: string) => {
	setPosition(pos as any);
};

const handleSizeChange = (sizeId: string) => {
	selectedSize.value = sizeId;
	const size = sizes.find((s) => s.id === sizeId);
	if (size) {
		resize(size.width, size.height);
	}
};

watch(() => state.isActive, (active) => {
	emit("pip-change", active);
});
</script>

<template>
	<div>
		<!-- PIP Container (rendered in parent container) -->
		<div
			v-if="state.isActive"
			ref="pipContainerRef"
			:style="containerStyle"
			@mousedown="startDrag"
			@touchstart="startDrag"
		>
			<video
				ref="webcamVideo"
				:style="videoStyle"
				autoplay
				muted
				playsinline
			/>
			<div class="absolute top-1 right-1 flex gap-1">
				<button
					class="p-1 bg-black/50 hover:bg-black/70 text-white rounded text-xs"
					@click="deactivate"
				>
					<Icon name="mdi:close" class="w-3 h-3" />
				</button>
			</div>
			<div class="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
				Webcam
			</div>
		</div>

		<!-- Control Panel -->
		<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
					Picture-in-Picture
				</h3>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						class="sr-only peer"
						:checked="state.isActive"
						@change="handleToggle"
					>
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
				</label>
			</div>

			<div v-if="state.isActive" class="space-y-3">
				<!-- Position -->
				<div>
					<label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
					<div class="grid grid-cols-2 gap-2">
						<button
							v-for="pos in positions"
							:key="pos.id"
							class="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-sm transition-all"
							:class="state.position === pos.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'"
							@click="handlePositionChange(pos.id)"
						>
							<Icon :name="pos.icon" class="w-4 h-4" />
							{{ pos.name }}
						</button>
					</div>
				</div>

				<!-- Size -->
				<div>
					<label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Size</label>
					<div class="flex gap-2">
						<button
							v-for="size in sizes"
							:key="size.id"
							class="flex-1 px-3 py-2 rounded-lg border text-sm transition-all"
							:class="selectedSize === size.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'"
							@click="handleSizeChange(size.id)"
						>
							{{ size.name }}
						</button>
					</div>
				</div>

				<!-- Info -->
				<div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
					<Icon name="mdi:cursor-move" class="w-3 h-3" />
					Drag to move manually
				</div>
			</div>
		</div>
	</div>
</template>
