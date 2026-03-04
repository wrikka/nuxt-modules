<script setup lang="ts">
const props = defineProps<{
	show: boolean;
}>();

const emit = defineEmits<{
	close: [];
	finish: [];
}>();

const currentStep = ref(0);

const steps = [
	{
		title: "Welcome to Media Studio",
		description:
			"Create stunning designs with our powerful editor. Let's take a quick tour.",
		icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
	},
	{
		title: "Toolbar",
		description:
			"Add shapes, text, and images. Use alignment tools and undo/redo.",
		icon: "M4 6h16M4 12h16M4 18h16",
	},
	{
		title: "Canvas",
		description:
			"Your design workspace. Drag to move, scroll to zoom, right-click for options.",
		icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z",
	},
	{
		title: "Properties Panel",
		description:
			"Edit selected element properties - position, size, colors, and more.",
		icon:
			"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
	},
	{
		title: "Layers Panel",
		description: "Manage all elements. Search, reorder, lock, and hide layers.",
		icon:
			"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
	},
];

const nextStep = () => {
	if (currentStep.value < steps.length - 1) {
		currentStep.value++;
	} else {
		emit("finish");
	}
};

const prevStep = () => {
	if (currentStep.value > 0) {
		currentStep.value--;
	}
};

const skip = () => {
	emit("close");
};
</script>

<template>
	<Modal :show="show" size="sm" @close="$emit('close')">
		<div class="p-6 text-center">
			<div class="mb-6">
				<div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg
						class="w-8 h-8 text-blue-600 dark:text-blue-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							:d="steps[currentStep]?.icon"
						/>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					{{ steps[currentStep]?.title }}
				</h3>
				<p class="text-gray-600 dark:text-gray-300">
					{{ steps[currentStep]?.description }}
				</p>
			</div>

			<!-- Progress dots -->
			<div class="flex justify-center gap-2 mb-6">
				<button
					v-for="(_, idx) in steps"
					:key="idx"
					class="w-2 h-2 rounded-full transition-colors"
					:class="idx === currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
					@click="currentStep = idx"
				/>
			</div>

			<div class="flex gap-3 justify-center">
				<Button v-if="currentStep > 0" variant="secondary" @click="prevStep">
					Back
				</Button>
				<Button variant="secondary" @click="skip">
					Skip Tour
				</Button>
				<Button variant="primary" @click="nextStep">
					{{ currentStep === steps.length - 1 ? "Get Started" : "Next" }}
				</Button>
			</div>
		</div>
	</Modal>
</template>
