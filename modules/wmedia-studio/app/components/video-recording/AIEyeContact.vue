<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const correctionStrength = defineModel<number>("strength", { default: 75 });
const gazeTarget = defineModel<"camera" | "audience" | "auto">("gazeTarget", {
	default: "camera",
});
const naturalness = defineModel<number>("naturalness", { default: 85 });

const gazeOptions = [
	{
		value: "camera",
		label: "Always Look at Camera",
		icon: "mdi:camera",
		description: "Maintain direct eye contact",
	},
	{
		value: "audience",
		label: "Audience View",
		icon: "mdi:account-group",
		description: "Look at virtual audience",
	},
	{
		value: "auto",
		label: "Smart Switch",
		icon: "mdi:auto-fix",
		description: "Auto-detect reading vs speaking",
	},
] as const;
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
					<Icon
						name="mdi:eye"
						class="w-5 h-5 text-blue-600 dark:text-blue-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						AI Eye Contact Correction
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Appear to look at camera while reading
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-blue-600 mt-0.5" />
					<p class="text-xs text-blue-700 dark:text-blue-300">
						AI subtly adjusts eye direction in real-time so you appear to be
						looking at the camera even when reading notes or looking at a second
						monitor.
					</p>
				</div>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
				>Gaze Target</label>
				<div class="grid grid-cols-1 gap-2">
					<button
						v-for="option in gazeOptions"
						:key="option.value"
						:class="[
							'flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
							gazeTarget === option.value
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-blue-300',
						]"
						@click="gazeTarget = option.value"
					>
						<Icon
							:name="option.icon"
							class="w-5 h-5"
							:class="gazeTarget === option.value ? 'text-blue-600' : 'text-gray-500'"
						/>
						<div>
							<div class="text-sm font-medium text-gray-900 dark:text-white">
								{{ option.label }}
							</div>
							<div class="text-xs text-gray-500">{{ option.description }}</div>
						</div>
					</button>
				</div>
			</div>

			<div class="space-y-3">
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300"
						>Correction Strength</span>
						<span class="text-gray-500">{{ correctionStrength }}%</span>
					</div>
					<input
						v-model.number="correctionStrength"
						type="range"
						min="0"
						max="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Naturalness</span>
						<span class="text-gray-500">{{ naturalness }}%</span>
					</div>
					<input
						v-model.number="naturalness"
						type="range"
						min="0"
						max="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
					>
					<p class="text-xs text-gray-500 mt-1">
						Higher values look more natural but may be less accurate
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
