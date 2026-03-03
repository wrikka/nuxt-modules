<script setup lang="ts">
const emit = defineEmits<
	{ close: []; apply: [preset: string, intensity: number] }
>();
const selectedPreset = ref("cinematic");
const intensity = ref(75);
const customAdjustments = ref({ contrast: 0, saturation: 10, warmth: 5 });

const presets = [
	{ id: "cinematic", name: "Cinematic", color: "bg-blue-900" },
	{ id: "vintage", name: "Vintage", color: "bg-yellow-800" },
	{ id: "noir", name: "Film Noir", color: "bg-gray-900" },
	{ id: "vibrant", name: "Vibrant", color: "bg-pink-700" },
	{ id: "natural", name: "Natural", color: "bg-green-800" },
	{ id: "cyber", name: "Cyberpunk", color: "bg-purple-900" },
];

const apply = () => emit("apply", selectedPreset.value, intensity.value);
</script>
<template>
	<div class="color-grading-presets bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-palette" class="w-5 h-5" />Color Grading Presets
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div
			class="aspect-video rounded-lg mb-4 overflow-hidden"
			:class="presets.find(p => p.id === selectedPreset)?.color"
		>
			<div class="w-full h-full flex items-center justify-center text-white/50 text-sm">
				Color Preview
			</div>
		</div>
		<div class="grid grid-cols-3 gap-2 mb-4">
			<button
				v-for="p in presets"
				:key="p.id"
				class="p-2 rounded-lg text-center"
				:class="selectedPreset === p.id ? 'ring-2 ring-white' : ''"
				@click="selectedPreset = p.id"
			>
				<div class="w-full h-8 rounded mb-1" :class="p.color" />
				<div class="text-white text-xs">{{ p.name }}</div>
			</button>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-300">Intensity</span><span
					class="text-blue-400"
				>{{ intensity }}%</span>
			</div>
			<input
				v-model="intensity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-700 rounded-lg"
			/>
		</div>
		<div class="space-y-2 mb-4">
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Contrast</span><span
						class="text-gray-300"
					>{{ customAdjustments.contrast }}</span>
				</div><input
					v-model="customAdjustments.contrast"
					type="range"
					min="-50"
					max="50"
					class="w-full h-1.5 bg-gray-700 rounded-lg"
				/>
			</div>
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Saturation</span><span
						class="text-gray-300"
					>{{ customAdjustments.saturation }}</span>
				</div><input
					v-model="customAdjustments.saturation"
					type="range"
					min="-50"
					max="50"
					class="w-full h-1.5 bg-gray-700 rounded-lg"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
			@click="apply"
		>
			Apply Grading
		</button>
	</div>
</template>
