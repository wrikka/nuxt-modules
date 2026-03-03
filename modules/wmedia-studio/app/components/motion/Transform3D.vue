<script setup lang="ts">
const show3D = ref(false);

const transform3D = ref({
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
	translateZ: 0,
	scaleZ: 1,
	perspective: 1000,
	perspectiveOrigin: "center",
	transformStyle: "preserve-3d",
});

const presets = [
	{ name: "Flip Card", rotateX: 0, rotateY: 180, rotateZ: 0 },
	{ name: "Cube Face", rotateX: 0, rotateY: 90, rotateZ: 0 },
	{ name: "Tilt Left", rotateX: 0, rotateY: -15, rotateZ: 0 },
	{ name: "Tilt Right", rotateX: 0, rotateY: 15, rotateZ: 0 },
	{ name: "Top View", rotateX: 45, rotateY: 0, rotateZ: 0 },
	{ name: "Isometric", rotateX: 55, rotateY: -45, rotateZ: 0 },
];

const applyPreset = (preset: typeof presets[0]) => {
	transform3D.value.rotateX = preset.rotateX;
	transform3D.value.rotateY = preset.rotateY;
	transform3D.value.rotateZ = preset.rotateZ;
};

const resetTransform = () => {
	transform3D.value = {
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		translateZ: 0,
		scaleZ: 1,
		perspective: 1000,
		perspectiveOrigin: "center",
		transformStyle: "preserve-3d",
	};
};
</script>

<template>
	<div>
		<button
			class="fixed right-56 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-violet-400 ring-offset-2': show3D }"
			@click="show3D = !show3D"
			title="3D Transform"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m21 16-9 5-9-5" />
				<path d="m21 12-9 5-9-5" />
				<path d="m21 8-9 5-9-5" />
				<path d="m21 4-9 5-9-5" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div
				v-if="show3D"
				class="fixed right-0 top-0 z-40 h-screen w-96 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gradient-to-r from-violet-600 to-purple-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">3D Transform</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="show3D = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="h-[calc(100vh-80px)] overflow-y-auto p-4">
					<!-- 3D Preview -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<div
							class="relative mx-auto h-40 w-40 transition-transform duration-500"
							:style="{
								perspective: `${transform3D.perspective}px`,
								transformStyle: transform3D.transformStyle,
							} as any"
						>
							<div
								class="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg"
								:style="{
									transform:
										`rotateX(${transform3D.rotateX}deg) rotateY(${transform3D.rotateY}deg) rotateZ(${transform3D.rotateZ}deg) translateZ(${transform3D.translateZ}px) scaleZ(${transform3D.scaleZ})`,
									transformStyle: transform3D.transformStyle,
								} as any"
							>
								<span class="text-2xl font-bold">3D</span>
							</div>
						</div>
						<p class="mt-2 text-center text-xs text-gray-500">Live Preview</p>
					</div>

					<!-- Presets -->
					<div class="mb-6">
						<h3 class="mb-2 text-xs font-medium text-gray-500">Presets</h3>
						<div class="grid grid-cols-3 gap-2">
							<button
								v-for="preset in presets"
								:key="preset.name"
								class="rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-violet-500 hover:bg-violet-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-violet-900/20"
								@click="applyPreset(preset)"
							>
								{{ preset.name }}
							</button>
						</div>
					</div>

					<!-- Transform Controls -->
					<div class="space-y-4">
						<div>
							<div class="mb-2 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Rotate X</label>
								<span class="text-xs text-gray-500">{{
										transform3D.rotateX
									}}°</span>
							</div>
							<input
								v-model.number="transform3D.rotateX"
								type="range"
								min="-360"
								max="360"
								class="w-full"
							/>
						</div>

						<div>
							<div class="mb-2 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Rotate Y</label>
								<span class="text-xs text-gray-500">{{
										transform3D.rotateY
									}}°</span>
							</div>
							<input
								v-model.number="transform3D.rotateY"
								type="range"
								min="-360"
								max="360"
								class="w-full"
							/>
						</div>

						<div>
							<div class="mb-2 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Rotate Z</label>
								<span class="text-xs text-gray-500">{{
										transform3D.rotateZ
									}}°</span>
							</div>
							<input
								v-model.number="transform3D.rotateZ"
								type="range"
								min="-360"
								max="360"
								class="w-full"
							/>
						</div>

						<div>
							<div class="mb-2 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Translate Z</label>
								<span class="text-xs text-gray-500">{{
										transform3D.translateZ
									}}px</span>
							</div>
							<input
								v-model.number="transform3D.translateZ"
								type="range"
								min="-500"
								max="500"
								class="w-full"
							/>
						</div>

						<div>
							<div class="mb-2 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Perspective</label>
								<span class="text-xs text-gray-500">{{
										transform3D.perspective
									}}px</span>
							</div>
							<input
								v-model.number="transform3D.perspective"
								type="range"
								min="100"
								max="2000"
								class="w-full"
							/>
						</div>
					</div>

					<!-- Actions -->
					<button
						class="mt-6 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
						@click="resetTransform"
					>
						Reset Transform
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
