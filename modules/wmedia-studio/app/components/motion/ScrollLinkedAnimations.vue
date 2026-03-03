<script setup lang="ts">
const showScrollPanel = ref(false);

interface ScrollAnimation {
	id: string;
	elementId: string;
	trigger: "enter" | "center" | "exit";
	start: number;
	end: number;
	properties: {
		x?: { from: number; to: number };
		y?: { from: number; to: number };
		scale?: { from: number; to: number };
		rotation?: { from: number; to: number };
		opacity?: { from: number; to: number };
	};
	scrub: boolean;
	pin: boolean;
}

const scrollAnimations = ref<ScrollAnimation[]>([]);
const selectedElement = ref<string>("");

const addScrollAnimation = () => {
	const newAnim: ScrollAnimation = {
		id: crypto.randomUUID(),
		elementId: selectedElement.value,
		trigger: "center",
		start: 0,
		end: 100,
		properties: {
			y: { from: 100, to: 0 },
			opacity: { from: 0, to: 1 },
		},
		scrub: true,
		pin: false,
	};
	scrollAnimations.value.push(newAnim);
};

const removeAnimation = (id: string) => {
	scrollAnimations.value = scrollAnimations.value.filter((a) => a.id !== id);
};

const presets = [
	{
		name: "Fade In Up",
		icon: "↑",
		properties: { y: { from: 50, to: 0 }, opacity: { from: 0, to: 1 } },
	},
	{
		name: "Fade In Down",
		icon: "↓",
		properties: { y: { from: -50, to: 0 }, opacity: { from: 0, to: 1 } },
	},
	{
		name: "Scale In",
		icon: "○",
		properties: { scale: { from: 0.8, to: 1 }, opacity: { from: 0, to: 1 } },
	},
	{
		name: "Rotate In",
		icon: "↻",
		properties: { rotation: { from: -15, to: 0 }, opacity: { from: 0, to: 1 } },
	},
	{ name: "Slide Left", icon: "←", properties: { x: { from: 100, to: 0 } } },
	{ name: "Slide Right", icon: "→", properties: { x: { from: -100, to: 0 } } },
];

const applyPreset = (preset: typeof presets[0]) => {
	const newAnim: ScrollAnimation = {
		id: crypto.randomUUID(),
		elementId: selectedElement.value,
		trigger: "center",
		start: 0,
		end: 100,
		properties: preset.properties,
		scrub: true,
		pin: false,
	};
	scrollAnimations.value.push(newAnim);
};
</script>

<template>
	<div>
		<button
			class="fixed right-32 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-indigo-400 ring-offset-2': showScrollPanel }"
			@click="showScrollPanel = !showScrollPanel"
			title="Scroll Animations"
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
				<path d="M12 5v14" />
				<path d="m19 12-7 7-7-7" />
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
				v-if="showScrollPanel"
				class="fixed right-0 top-0 z-40 h-screen w-96 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Scroll-Linked</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showScrollPanel = false"
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
					<!-- Presets -->
					<div class="mb-6">
						<h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
							Quick Presets
						</h3>
						<div class="grid grid-cols-3 gap-2">
							<button
								v-for="preset in presets"
								:key="preset.name"
								class="flex flex-col items-center gap-1 rounded-lg border border-gray-200 p-3 transition-colors hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20"
								@click="applyPreset(preset)"
							>
								<span class="text-lg">{{ preset.icon }}</span>
								<span class="text-xs text-gray-600 dark:text-gray-400">{{
									preset.name
								}}</span>
							</button>
						</div>
					</div>

					<!-- Animations List -->
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white">
							Animations
						</h3>
						<button
							class="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
							@click="addScrollAnimation"
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
							v-for="anim in scrollAnimations"
							:key="anim.id"
							class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
						>
							<div class="mb-2 flex items-center justify-between">
								<span class="text-sm font-medium text-gray-900 dark:text-white"
								>Scroll Animation</span>
								<button
									class="text-gray-400 hover:text-red-500"
									@click="removeAnimation(anim.id)"
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
								<div class="flex items-center gap-2">
									<label class="text-xs text-gray-500">Trigger:</label>
									<select
										v-model="anim.trigger"
										class="rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
									>
										<option value="enter">Enter</option>
										<option value="center">Center</option>
										<option value="exit">Exit</option>
									</select>
								</div>

								<div class="flex items-center gap-2">
									<label class="text-xs text-gray-500">Start:</label>
									<input
										v-model.number="anim.start"
										type="number"
										class="w-16 rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
									/>
									<label class="text-xs text-gray-500">End:</label>
									<input
										v-model.number="anim.end"
										type="number"
										class="w-16 rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
									/>
								</div>

								<div class="flex gap-4">
									<label class="flex items-center gap-1 text-xs">
										<input
											v-model="anim.scrub"
											type="checkbox"
											class="rounded"
										/>
										<span class="text-gray-600 dark:text-gray-400">Scrub</span>
									</label>
									<label class="flex items-center gap-1 text-xs">
										<input v-model="anim.pin" type="checkbox" class="rounded" />
										<span class="text-gray-600 dark:text-gray-400">Pin</span>
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
