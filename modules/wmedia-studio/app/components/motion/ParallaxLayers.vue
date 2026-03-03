<script setup lang="ts">
const showParallax = ref(false);

interface ParallaxLayer {
	id: string;
	elementId: string;
	speed: number;
	direction: "vertical" | "horizontal" | "both";
	invert: boolean;
}

const layers = ref<ParallaxLayer[]>([
	{
		id: "1",
		elementId: "bg",
		speed: 0.2,
		direction: "vertical",
		invert: false,
	},
	{
		id: "2",
		elementId: "mid",
		speed: 0.5,
		direction: "vertical",
		invert: false,
	},
	{
		id: "3",
		elementId: "fg",
		speed: 0.8,
		direction: "vertical",
		invert: false,
	},
]);

const addLayer = () => {
	layers.value.push({
		id: window.crypto.randomUUID(),
		elementId: `layer-${layers.value.length + 1}`,
		speed: 0.5,
		direction: "vertical",
		invert: false,
	});
};

const generateId = () => window.crypto.randomUUID();

const removeLayer = (id: string) => {
	layers.value = layers.value.filter((l) => l.id !== id);
};

const presets = [
	{ name: "Deep Background", speed: 0.1 },
	{ name: "Mid Ground", speed: 0.4 },
	{ name: "Foreground", speed: 0.7 },
	{ name: "Fixed", speed: 0 },
	{ name: "Reverse", speed: -0.3 },
];
</script>

<template>
	<div>
		<button
			class="fixed right-44 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-teal-400 ring-offset-2': showParallax }"
			@click="showParallax = !showParallax"
			title="Parallax Layers"
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
				<rect width="18" height="18" x="3" y="3" rx="2" />
				<path d="M3 9h18" />
				<path d="M3 15h18" />
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
				v-if="showParallax"
				class="fixed right-0 top-0 z-40 h-screen w-80 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Parallax</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showParallax = false"
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
					<!-- Visual Preview -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<div class="relative h-32 overflow-hidden rounded-lg bg-gradient-to-b from-blue-200 to-blue-400">
							<div
								v-for="(layer, i) in layers"
								:key="layer.id"
								class="absolute rounded-lg border-2 border-white/50 bg-white/80 backdrop-blur"
								:style="{
									width: `${80 - i * 15}%`,
									height: `${60 - i * 10}px`,
									left: `${10 + i * 5}%`,
									top: `${20 + i * 15}px`,
									opacity: 0.7 - i * 0.1,
								}"
							>
								<span class="p-2 text-xs text-gray-600"
								>Layer {{ i + 1 }} ({{ layer.speed }}x)</span>
							</div>
						</div>
						<p class="mt-2 text-center text-xs text-gray-500">
							Parallax Preview
						</p>
					</div>

					<!-- Quick Presets -->
					<div class="mb-4">
						<h3 class="mb-2 text-xs font-medium text-gray-500">
							Speed Presets
						</h3>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="preset in presets"
								:key="preset.name"
								class="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300"
								@click="layers.push({
									id: generateId(),
									elementId: preset.name.toLowerCase().replace(' ', '-'),
									speed: preset.speed,
									direction: 'vertical',
									invert: false,
								})"
							>
								{{ preset.name }}
							</button>
						</div>
					</div>

					<!-- Layers List -->
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white">
							Layers ({{ layers.length }})
						</h3>
						<button
							class="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
							@click="addLayer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14" />
								<path d="M12 5v14" />
							</svg>
							Add
						</button>
					</div>

					<div class="space-y-3">
						<div
							v-for="(layer, index) in layers"
							:key="layer.id"
							class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
						>
							<div class="mb-2 flex items-center justify-between">
								<span
									class="text-sm font-medium text-gray-900 dark:text-white"
								>Layer {{ index + 1 }}</span>
								<button
									class="text-gray-400 hover:text-red-500"
									@click="removeLayer(layer.id)"
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
										<path d="M18 6 6 18" />
										<path d="m6 6 12 12" />
									</svg>
								</button>
							</div>

							<div class="space-y-2">
								<div>
									<label class="mb-1 block text-xs text-gray-500"
									>Speed Multiplier</label>
									<input
										v-model.number="layer.speed"
										type="range"
										min="-1"
										max="1"
										step="0.1"
										class="w-full"
									/>
									<div class="flex justify-between text-xs text-gray-500">
										<span>-1x</span>
										<span class="font-medium text-teal-600">{{
												layer.speed
											}}x</span>
										<span>1x</span>
									</div>
								</div>

								<div class="flex gap-2">
									<select
										v-model="layer.direction"
										class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
									>
										<option value="vertical">Vertical</option>
										<option value="horizontal">Horizontal</option>
										<option value="both">Both</option>
									</select>
									<label class="flex items-center gap-1 text-xs">
										<input
											v-model="layer.invert"
											type="checkbox"
											class="rounded"
										/>
										<span class="text-gray-600">Invert</span>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
