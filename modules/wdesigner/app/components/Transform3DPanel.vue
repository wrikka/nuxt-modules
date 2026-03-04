<script setup lang="ts">
export interface Transform3D {
	rotateX: number;
	rotateY: number;
	rotateZ: number;
	translateX: number;
	translateY: number;
	translateZ: number;
	scale: number;
	perspective: number;
}

const props = defineProps<{
	transform: Transform3D;
	previewSize: number;
}>();

const emit = defineEmits<{
	(e: "update:transform", value: Transform3D): void;
	(e: "reset"): void;
	(e: "apply"): void;
}>();

const updateTransform = (updates: Partial<Transform3D>) => {
	emit("update:transform", { ...props.transform, ...updates });
};

const transformStyle = computed(() => {
	const {
		rotateX,
		rotateY,
		rotateZ,
		translateX,
		translateY,
		translateZ,
		scale,
		perspective,
	} = props.transform;
	return {
		transform: `
      perspective(${perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      rotateZ(${rotateZ}deg)
      translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
      scale(${scale})
    `,
		transformStyle: "preserve-3d" as const,
	};
});

const presets = [
	{ name: "Front", rotateX: 0, rotateY: 0, rotateZ: 0 },
	{ name: "Back", rotateX: 0, rotateY: 180, rotateZ: 0 },
	{ name: "Left", rotateX: 0, rotateY: -90, rotateZ: 0 },
	{ name: "Right", rotateX: 0, rotateY: 90, rotateZ: 0 },
	{ name: "Top", rotateX: -90, rotateY: 0, rotateZ: 0 },
	{ name: "Bottom", rotateX: 90, rotateY: 0, rotateZ: 0 },
	{ name: "Isometric", rotateX: -35.264, rotateY: 45, rotateZ: 0 },
];
</script>

<template>
	<div class="space-y-3">
		<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
		>3D Transform Preview</label>

		<div class="grid grid-cols-7 gap-1">
			<button
				v-for="preset in presets"
				:key="preset.name"
				type="button"
				class="p-1.5 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 text-xs text-center transition-colors"
				@click="updateTransform({
					rotateX: preset.rotateX,
					rotateY: preset.rotateY,
					rotateZ: preset.rotateZ,
				})"
			>
				{{ preset.name }}
			</button>
		</div>

		<div
			class="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded perspective-container"
			:style="{ perspective: `${transform.perspective}px` }"
		>
			<div
				class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-lg flex items-center justify-center text-white font-bold transition-transform duration-300"
				:style="transformStyle"
			>
				<span class="text-lg">3D</span>
			</div>
		</div>

		<div class="space-y-2">
			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Rotate X:</label>
					<span class="text-xs text-gray-500">{{
							Math.round(transform.rotateX)
						}}°</span>
				</div>
				<input
					type="range"
					min="-180"
					max="180"
					:value="transform.rotateX"
					class="w-full"
					@input="updateTransform({
						rotateX: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Rotate Y:</label>
					<span class="text-xs text-gray-500">{{
							Math.round(transform.rotateY)
						}}°</span>
				</div>
				<input
					type="range"
					min="-180"
					max="180"
					:value="transform.rotateY"
					class="w-full"
					@input="updateTransform({
						rotateY: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Rotate Z:</label>
					<span class="text-xs text-gray-500">{{
							Math.round(transform.rotateZ)
						}}°</span>
				</div>
				<input
					type="range"
					min="-180"
					max="180"
					:value="transform.rotateZ"
					class="w-full"
					@input="updateTransform({
						rotateZ: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Perspective:</label>
					<span class="text-xs text-gray-500">{{
							transform.perspective
						}}px</span>
				</div>
				<input
					type="range"
					min="100"
					max="2000"
					step="50"
					:value="transform.perspective"
					class="w-full"
					@input="updateTransform({
						perspective: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400">Scale:</label>
					<span class="text-xs text-gray-500">{{
							transform.scale.toFixed(2)
						}}×</span>
				</div>
				<input
					type="range"
					min="0.1"
					max="3"
					step="0.1"
					:value="transform.scale"
					class="w-full"
					@input="updateTransform({
						scale: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>
		</div>

		<div class="flex gap-2">
			<button
				type="button"
				class="flex-1 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				@click="$emit('reset')"
			>
				Reset
			</button>
			<button
				type="button"
				class="flex-1 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				@click="$emit('apply')"
			>
				Apply
			</button>
		</div>
	</div>
</template>
