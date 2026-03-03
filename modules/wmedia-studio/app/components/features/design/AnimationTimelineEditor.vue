<script setup lang="ts">
const isOpen = ref(false);
const selectedElement = ref<string | null>(null);
const currentTime = ref(0);

const elements = ref([
	{
		id: "el1",
		name: "Hero Text",
		type: "text",
		animations: [{ id: 1, type: "fadeIn", duration: 500, delay: 0 }],
	},
	{
		id: "el2",
		name: "CTA Button",
		type: "button",
		animations: [{ id: 2, type: "slideUp", duration: 400, delay: 200 }],
	},
	{
		id: "el3",
		name: "Background",
		type: "image",
		animations: [{ id: 3, type: "scale", duration: 1000, delay: 0 }],
	},
]);

const animationTypes = [
	"fadeIn",
	"fadeOut",
	"slideUp",
	"slideDown",
	"scale",
	"rotate",
	"bounce",
];

const timelineMarkers = Array.from({ length: 21 }, (_, i) => i * 100); // 0 to 2000ms

const addAnimation = (elementId: string) => {
	const element = elements.value.find(e => e.id === elementId);
	if (element) {
		element.animations.push({
			id: Date.now(),
			type: "fadeIn",
			duration: 500,
			delay: currentTime.value,
		});
	}
};

const playAnimation = () => {
	currentTime.value = 0;
	const interval = setInterval(() => {
		currentTime.value += 10;
		if (currentTime.value >= 2000) clearInterval(interval);
	}, 10);
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
			@click="isOpen = true"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class="text-sm font-medium">Animation</span>
		</button>

		<!-- Animation Editor Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-t-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-indigo-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Animation Timeline Editor
							</h3>
						</div>
						<div class="flex items-center gap-2">
							<button
								class="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
								@click="playAnimation"
							>
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8 5v14l11-7z" />
								</svg>
								Play
							</button>
							<button
								class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
								@click="isOpen = false"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Timeline -->
					<div class="p-4">
						<!-- Time Ruler -->
						<div class="flex text-xs text-gray-500 mb-2 pl-32">
							<span
								v-for="marker in timelineMarkers.filter((_, i) => i % 5 === 0)"
								:key="marker"
								class="flex-1"
							>
								{{ marker }}ms
							</span>
						</div>

						<!-- Playhead -->
						<div class="relative h-1 bg-gray-200 dark:bg-gray-700 mb-4 rounded">
							<div
								class="absolute top-0 w-0.5 h-4 -mt-1.5 bg-red-500"
								:style="{ left: `${(currentTime / 2000) * 100}%` }"
							>
								<div class="absolute -top-4 -left-2 text-xs text-red-500 font-mono">
									{{ currentTime }}ms
								</div>
							</div>
						</div>

						<!-- Elements List -->
						<div class="space-y-2 max-h-60 overflow-y-auto">
							<div
								v-for="element in elements"
								:key="element.id"
								class="flex items-center gap-2"
								:class="selectedElement === element.id
								? 'bg-indigo-50 dark:bg-indigo-900/20'
								: ''"
								@click="selectedElement = element.id"
							>
								<!-- Element Name -->
								<div class="w-28 text-sm truncate">{{ element.name }}</div>

								<!-- Timeline Track -->
								<div class="flex-1 h-10 bg-gray-100 dark:bg-gray-900 rounded relative">
									<!-- Animation Bars -->
									<div
										v-for="anim in element.animations"
										:key="anim.id"
										class="absolute h-8 top-1 rounded flex items-center px-2 text-xs text-white"
										:class="{
											'bg-indigo-500': anim.type === 'fadeIn',
											'bg-purple-500': anim.type === 'slideUp',
											'bg-pink-500': anim.type === 'scale',
											'bg-blue-500': anim.type === 'rotate',
											'bg-green-500': anim.type === 'bounce',
										}"
										:style="{
											left: `${(anim.delay / 2000) * 100}%`,
											width: `${(anim.duration / 2000) * 100}%`,
										}"
									>
										{{ anim.type }}
									</div>

									<!-- Add Animation Button -->
									<button
										class="absolute right-1 top-1 p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
										@click.stop="addAnimation(element.id)"
									>
										<svg
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Animation Properties -->
					<div
						v-if="selectedElement"
						class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
					>
						<div class="flex items-center gap-4">
							<span class="text-sm font-medium">Animation:</span>
							<select class="px-2 py-1 bg-white dark:bg-gray-700 rounded text-sm border">
								<option
									v-for="type in animationTypes"
									:key="type"
									:value="type"
								>
									{{ type }}
								</option>
							</select>
							<span class="text-sm">Duration:</span>
							<input
								type="number"
								value="500"
								class="w-20 px-2 py-1 bg-white dark:bg-gray-700 rounded text-sm border"
							>
							<span class="text-sm">ms</span>
							<span class="text-sm">Easing:</span>
							<select class="px-2 py-1 bg-white dark:bg-gray-700 rounded text-sm border">
								<option>ease-out</option>
								<option>ease-in</option>
								<option>linear</option>
								<option>bounce</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateY(100%);
}
</style>
