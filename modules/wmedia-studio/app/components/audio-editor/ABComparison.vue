<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const emit = defineEmits<{
	compare: [type: "a" | "b"];
	apply: [];
	reset: [];
}>();

const isEnabled = ref(false);
const currentView = ref<"a" | "b">("a");
const bypassEffects = ref(false);

const toggleComparison = () => {
	isEnabled.value = !isEnabled.value;
	if (isEnabled.value) {
		emit("compare", currentView.value);
	}
};

const switchView = (view: "a" | "b") => {
	currentView.value = view;
	if (isEnabled.value) {
		emit("compare", view);
	}
};

const applyB = () => {
	emit("apply");
};

const resetToA = () => {
	emit("reset");
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">A/B Comparison</span>
			<button
				@click="toggleComparison"
				:class="[
					'px-2 py-1 rounded text-xs transition-colors',
					isEnabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400',
				]"
			>
				{{ isEnabled ? "ON" : "OFF" }}
			</button>
		</div>

		<div class="flex items-center justify-center gap-4 mb-4">
			<button
				@click="switchView('a')"
				:class="[
					'w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all',
					currentView === 'a'
						? 'bg-blue-600 text-white shadow-lg scale-105'
						: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
				]"
			>
				<span class="text-lg font-bold">A</span>
				<span class="text-xs">Before</span>
			</button>

			<div class="text-gray-500 text-xs">VS</div>

			<button
				@click="switchView('b')"
				:class="[
					'w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all',
					currentView === 'b'
						? 'bg-purple-600 text-white shadow-lg scale-105'
						: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
				]"
			>
				<span class="text-lg font-bold">B</span>
				<span class="text-xs">After</span>
			</button>
		</div>

		<div class="space-y-2">
			<label
				class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"
			>
				<input v-model="bypassEffects" type="checkbox" class="accent-blue-500">
				Bypass all effects when comparing
			</label>
		</div>

		<div class="mt-4 flex gap-2">
			<button
				@click="applyB"
				:disabled="!isEnabled"
				class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				Apply B
			</button>
			<button
				@click="resetToA"
				:disabled="!isEnabled"
				class="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				Reset to A
			</button>
		</div>

		<p class="mt-3 text-xs text-gray-500">
			Quickly compare your audio before and after applying effects.
		</p>
	</div>
</template>
