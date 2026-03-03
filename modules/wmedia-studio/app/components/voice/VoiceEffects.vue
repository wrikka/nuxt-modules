<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	applyEffect: [effect: string, intensity: number];
}>();

const selectedEffect = ref("reverb");
const intensity = ref(50);
const isPreviewing = ref(false);

const effects = [
	{
		id: "reverb",
		name: "Reverb",
		icon: "i-ph-waves",
		description: "Add space and depth",
	},
	{
		id: "delay",
		name: "Delay",
		icon: "i-ph-corners-out",
		description: "Echo effect",
	},
	{
		id: "chorus",
		name: "Chorus",
		icon: "iph-users",
		description: "Thickens the sound",
	},
	{
		id: "pitch",
		name: "Pitch Shift",
		icon: "i-ph-arrows-vertical",
		description: "Change pitch up or down",
	},
	{
		id: "distortion",
		name: "Distortion",
		icon: "i-ph-wave-sawtooth",
		description: "Add grit and edge",
	},
	{
		id: "flanger",
		name: "Flanger",
		icon: "i-ph-spiral",
		description: "Sweeping effect",
	},
	{
		id: "phaser",
		name: "Phaser",
		icon: "i-ph-planet",
		description: "Swirling sound",
	},
	{
		id: "autotune",
		name: "Auto-Tune",
		icon: "iph-music-notes",
		description: "Pitch correction",
	},
];

const presets = [
	{ name: "Radio Voice", effect: "reverb", intensity: 30 },
	{ name: "Robot", effect: "pitch", intensity: 80 },
	{ name: "Echo Chamber", effect: "delay", intensity: 60 },
	{ name: "Monster", effect: "pitch", intensity: -50 },
	{ name: "Telephone", effect: "distortion", intensity: 20 },
];

const applyPreset = (preset: typeof presets[0]) => {
	selectedEffect.value = preset.effect;
	intensity.value = Math.abs(preset.intensity);
};

const togglePreview = () => {
	isPreviewing.value = !isPreviewing.value;
};

const applyEffect = () => {
	emit("applyEffect", selectedEffect.value, intensity.value);
};
</script>

<template>
	<div class="voice-effects bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="iph-sliders" class="w-5 h-5" />
				Voice Effects
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<!-- Presets -->
		<div class="mb-4">
			<label class="text-gray-400 text-xs mb-2 block">Quick Presets</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-xs transition-colors"
					@click="applyPreset(preset)"
				>
					{{ preset.name }}
				</button>
			</div>
		</div>

		<!-- Effects Grid -->
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block">Select Effect</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="effect in effects"
					:key="effect.id"
					class="p-3 rounded-lg transition-colors text-left"
					:class="selectedEffect === effect.id
					? 'bg-blue-600/30 ring-1 ring-blue-500'
					: 'bg-gray-700/50 hover:bg-gray-700'"
					@click="selectedEffect = effect.id"
				>
					<div class="flex items-center gap-2">
						<Icon :name="effect.icon" class="w-4 h-4 text-gray-400" />
						<div>
							<div class="text-white text-sm">{{ effect.name }}</div>
							<div class="text-gray-500 text-xs">{{ effect.description }}</div>
						</div>
					</div>
				</button>
			</div>
		</div>

		<!-- Intensity Slider -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-300 text-sm">Intensity</label>
				<span class="text-blue-400 text-sm font-mono">{{ intensity }}%</span>
			</div>
			<input
				v-model="intensity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
			>
			<div class="flex justify-between text-xs text-gray-500 mt-1">
				<span>Subtle</span>
				<span>Extreme</span>
			</div>
		</div>

		<!-- Preview & Apply -->
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
				:class="isPreviewing ? 'ring-2 ring-blue-500' : ''"
				@click="togglePreview"
			>
				<Icon
					:name="isPreviewing ? 'i-ph-stop' : 'i-ph-play'"
					class="w-4 h-4"
				/>
				{{ isPreviewing ? "Stop" : "Preview" }}
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
				@click="applyEffect"
			>
				Apply Effect
			</button>
		</div>
	</div>
</template>
