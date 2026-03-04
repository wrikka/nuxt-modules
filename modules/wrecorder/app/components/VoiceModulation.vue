<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const selectedEffect = defineModel<string>("effect", { default: "normal" });
const pitch = defineModel<number>("pitch", { default: 0 });
const reverb = defineModel<number>("reverb", { default: 30 });
const distortion = defineModel<number>("distortion", { default: 0 });

const effects = [
	{
		id: "normal",
		name: "Normal",
		icon: "mdi:account-voice",
		description: "No modification",
	},
	{
		id: "deep",
		name: "Deep Voice",
		icon: "mdi:bullhorn",
		description: "Lower pitch -30%",
	},
	{
		id: "chipmunk",
		name: "Chipmunk",
		icon: "mdi:squirrel",
		description: "Higher pitch +50%",
	},
	{
		id: "robot",
		name: "Robot",
		icon: "mdi:robot",
		description: "Metallic, distorted",
	},
	{
		id: "echo",
		name: "Echo Chamber",
		icon: "mdi:music-clef-treble",
		description: "Heavy reverb",
	},
	{
		id: "radio",
		name: "Radio",
		icon: "mdi:radio",
		description: "AM radio quality",
	},
	{
		id: "phone",
		name: "Phone",
		icon: "mdi:phone",
		description: "Telephone quality",
	},
	{
		id: "underwater",
		name: "Underwater",
		icon: "mdi:waves",
		description: "Muffled sound",
	},
	{
		id: "monster",
		name: "Monster",
		icon: "mdi:emoticon-devil",
		description: "Deep + distortion",
	},
	{
		id: "narrator",
		name: "Movie Narrator",
		icon: "mdi:movie",
		description: "Cinematic deep voice",
	},
] as const;

const isPreviewing = ref(false);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
					<Icon
						name="mdi:microphone-settings"
						class="w-5 h-5 text-teal-600 dark:text-teal-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Voice Modulation
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Real-time voice effects
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-teal-600 mt-0.5" />
					<p class="text-xs text-teal-700 dark:text-teal-300">
						Apply real-time voice effects during recording. Great for character
						voices, podcasts, or adding creative flair.
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="effect in effects"
					:key="effect.id"
					:class="[
						'p-3 rounded-lg border text-left transition-all',
						selectedEffect === effect.id
							? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
							: 'border-gray-200 dark:border-gray-700 hover:border-teal-300',
					]"
					@click="selectedEffect = effect.id"
				>
					<div class="flex items-center gap-2 mb-1">
						<Icon
							:name="effect.icon"
							class="w-5 h-5"
							:class="selectedEffect === effect.id ? 'text-teal-600' : 'text-gray-500'"
						/>
						<span
							class="text-sm font-medium"
							:class="selectedEffect === effect.id
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600 dark:text-gray-400'"
						>{{ effect.name }}</span>
					</div>
					<p class="text-xs text-gray-500">{{ effect.description }}</p>
				</button>
			</div>

			<div
				v-if="selectedEffect === 'custom' || selectedEffect === 'normal'"
				class="space-y-3"
			>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Pitch</span>
						<span class="text-gray-500">{{ pitch > 0 ? "+" : "" }}{{
								pitch
							}}%</span>
					</div>
					<input
						v-model.number="pitch"
						type="range"
						min="-50"
						max="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-teal-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Reverb</span>
						<span class="text-gray-500">{{ reverb }}%</span>
					</div>
					<input
						v-model.number="reverb"
						type="range"
						min="0"
						max="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-teal-600"
					>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Distortion</span>
						<span class="text-gray-500">{{ distortion }}%</span>
					</div>
					<input
						v-model.number="distortion"
						type="range"
						min="0"
						max="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-teal-600"
					>
				</div>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Test Your Voice
				</h4>
				<div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
					<button
						class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
						:class="isPreviewing
						? 'bg-red-500 hover:bg-red-600'
						: 'bg-teal-500 hover:bg-teal-600'"
						@click="isPreviewing = !isPreviewing"
					>
						<Icon
							:name="isPreviewing ? 'mdi:stop' : 'mdi:microphone'"
							class="w-6 h-6 text-white"
						/>
					</button>
					<div class="flex-1">
						<div
							class="text-sm font-medium"
							:class="isPreviewing
							? 'text-red-600'
							: 'text-gray-700 dark:text-gray-300'"
						>
							{{ isPreviewing ? "Recording..." : "Click to test" }}
						</div>
						<div class="text-xs text-gray-500">
							{{
								isPreviewing
								? "Speak now to preview effect"
								: "Record a sample with selected effect"
							}}
						</div>
					</div>
					<div v-if="isPreviewing" class="flex gap-0.5">
						<div
							v-for="i in 5"
							:key="i"
							class="w-1 bg-teal-500 rounded animate-pulse"
							:style="{
								height: `${Math.random() * 20 + 8}px`,
								animationDelay: `${i * 100}ms`,
							}"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
