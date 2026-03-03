<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const framingMode = defineModel<
	"center" | "upper-body" | "headshot" | "dynamic"
>("framingMode", { default: "center" });
const smoothness = defineModel<number>("smoothness", { default: 50 });
const trackingSpeed = defineModel<number>("trackingSpeed", { default: 75 });

const framingOptions = [
	{
		value: "center",
		label: "Center Frame",
		icon: "mdi:crop-free",
		description: "Keep subject in center",
	},
	{
		value: "upper-body",
		label: "Upper Body",
		icon: "mdi:account",
		description: "Frame upper torso",
	},
	{
		value: "headshot",
		label: "Headshot",
		icon: "mdi:face-recognition",
		description: "Focus on face only",
	},
	{
		value: "dynamic",
		label: "Dynamic",
		icon: "mdi:motion",
		description: "Smart movement prediction",
	},
] as const;
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
					<Icon
						name="mdi:face-recognition"
						class="w-5 h-5 text-purple-600 dark:text-purple-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						AI Auto-Framing
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Intelligent subject tracking
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="option in framingOptions"
					:key="option.value"
					:class="[
						'p-3 rounded-lg border text-left transition-all',
						framingMode === option.value
							? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
							: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
					]"
					@click="framingMode = option.value"
				>
					<Icon
						:name="option.icon"
						class="w-5 h-5 mb-1"
						:class="framingMode === option.value ? 'text-purple-600' : 'text-gray-500'"
					/>
					<div class="text-sm font-medium text-gray-900 dark:text-white">
						{{ option.label }}
					</div>
					<div class="text-xs text-gray-500">{{ option.description }}</div>
				</button>
			</div>

			<div class="space-y-3">
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300"
						>Tracking Smoothness</span>
						<span class="text-gray-500">{{ smoothness }}%</span>
					</div>
					<input
						v-model.number="smoothness"
						type="range"
						min="0"
						max="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Tracking Speed</span>
						<span class="text-gray-500">{{ trackingSpeed }}%</span>
					</div>
					<input
						v-model.number="trackingSpeed"
						type="range"
						min="0"
						max="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
					>
				</div>
			</div>

			<div class="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
				<Icon name="mdi:brain" class="w-4 h-4 text-purple-600" />
				<span class="text-xs text-purple-700 dark:text-purple-300"
				>AI model: MediaStudio-V1 (on-device)</span>
			</div>
		</div>
	</div>
</template>
