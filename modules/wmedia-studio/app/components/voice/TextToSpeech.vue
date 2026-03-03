<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	generateSpeech: [text: string, voice: string];
}>();

const text = ref("");
const selectedVoice = ref("th-1");
const speed = ref(1.0);
const pitch = ref(1.0);

const voices = [
	{ id: "th-1", name: "Thai - Female 1", lang: "Thai", gender: "Female" },
	{ id: "th-2", name: "Thai - Male 1", lang: "Thai", gender: "Male" },
	{ id: "en-1", name: "English - Female 1", lang: "English", gender: "Female" },
	{ id: "en-2", name: "English - Male 1", lang: "English", gender: "Male" },
	{
		id: "ja-1",
		name: "Japanese - Female 1",
		lang: "Japanese",
		gender: "Female",
	},
];

const sampleTexts = [
	"สวัสดีครับ ยินดีต้อนรับสู่ Media Studio",
	"Hello and welcome to Media Studio",
	"Thank you for watching this video",
];

const generate = () => {
	if (!text.value.trim()) return;
	emit("generateSpeech", text.value, selectedVoice.value);
};
</script>

<template>
	<div class="text-to-speech bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="iph-speaker-high" class="w-5 h-5" />
				Text to Speech
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<!-- Voice Selection -->
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block">Voice</label>
			<select
				v-model="selectedVoice"
				class="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
			>
				<optgroup
					v-for='lang in ["Thai", "English", "Japanese"]'
					:key="lang"
					:label="lang"
				>
					<option
						v-for="voice in voices.filter(v => v.lang === lang)"
						:key="voice.id"
						:value="voice.id"
					>
						{{ voice.gender }}
					</option>
				</optgroup>
			</select>
		</div>

		<!-- Text Input -->
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block">Text</label>
			<textarea
				v-model="text"
				placeholder="Enter text to convert to speech..."
				class="w-full h-32 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm resize-none"
			/>
			<div class="flex gap-2 mt-2">
				<button
					v-for="sample in sampleTexts"
					:key="sample"
					class="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs"
					@click="text = sample"
				>
					{{ sample.slice(0, 15) }}...
				</button>
			</div>
		</div>

		<!-- Speed & Pitch -->
		<div class="mb-4 space-y-3">
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">Speed</span>
					<span class="text-blue-400">{{ speed }}x</span>
				</div>
				<input
					v-model="speed"
					type="range"
					min="0.5"
					max="2"
					step="0.1"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-300">Pitch</span>
					<span class="text-blue-400">{{ pitch }}x</span>
				</div>
				<input
					v-model="pitch"
					type="range"
					min="0.5"
					max="2"
					step="0.1"
					class="w-full h-2 bg-gray-700 rounded-lg"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
				:disabled="!text.trim()"
				@click="generate"
			>
				<Icon name="i-ph-play" class="w-4 h-4" /> Generate
			</button>
		</div>
	</div>
</template>
