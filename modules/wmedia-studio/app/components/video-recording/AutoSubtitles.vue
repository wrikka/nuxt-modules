<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const language = defineModel<string>("language", { default: "en" });
const position = defineModel<"bottom" | "top" | "middle">("position", {
	default: "bottom",
});
const style = defineModel<"classic" | "modern" | "minimal">("style", {
	default: "modern",
});
const fontSize = defineModel<number>("fontSize", { default: 24 });
const maxLines = defineModel<number>("maxLines", { default: 2 });
const highlightSpeaker = defineModel<boolean>("highlightSpeaker", {
	default: true,
});
const profanityFilter = defineModel<boolean>("profanityFilter", {
	default: true,
});

const languages = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "es", name: "Spanish", flag: "🇪🇸" },
	{ code: "fr", name: "French", flag: "🇫🇷" },
	{ code: "de", name: "German", flag: "🇩🇪" },
	{ code: "ja", name: "Japanese", flag: "🇯🇵" },
	{ code: "ko", name: "Korean", flag: "🇰🇷" },
	{ code: "zh", name: "Chinese", flag: "🇨🇳" },
	{ code: "th", name: "Thai", flag: "🇹🇭" },
] as const;

const sampleSubtitles = [
	{ text: "Welcome to our tutorial today.", speaker: "Host", time: "00:00:05" },
	{
		text: "We'll be learning about video production.",
		speaker: "Host",
		time: "00:00:08",
	},
	{ text: "Let me show you the setup.", speaker: "Host", time: "00:00:12" },
];

const isRecording = ref(false);
const recognizedText = ref("");
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
					<Icon
						name="mdi:closed-caption"
						class="w-5 h-5 text-yellow-600 dark:text-yellow-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Auto-Generated Subtitles
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Real-time speech-to-text captions
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-yellow-600 mt-0.5" />
					<p class="text-xs text-yellow-700 dark:text-yellow-300">
						AI-powered real-time transcription. Subtitles are burned into video
						or saved as SRT files for accessibility and SEO.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Language</label>
				<select
					v-model="language"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
				>
					<option v-for="lang in languages" :key="lang.code" :value="lang.code">
						{{ lang.flag }} {{ lang.name }}
					</option>
				</select>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
					>Position</label>
					<select
						v-model="position"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
						<option value="bottom">Bottom</option>
						<option value="top">Top</option>
						<option value="middle">Middle</option>
					</select>
				</div>
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
					>Style</label>
					<select
						v-model="style"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
						<option value="classic">Classic</option>
						<option value="modern">Modern</option>
						<option value="minimal">Minimal</option>
					</select>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Font Size</span>
					<span class="text-gray-500">{{ fontSize }}px</span>
				</div>
				<input
					v-model.number="fontSize"
					type="range"
					min="12"
					max="48"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-600"
				>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Max Lines</span>
					<span class="text-gray-500">{{ maxLines }}</span>
				</div>
				<input
					v-model.number="maxLines"
					type="range"
					min="1"
					max="4"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-600"
				>
			</div>

			<div class="space-y-2">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="highlightSpeaker"
						type="checkbox"
						class="w-4 h-4 text-yellow-600 rounded"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Highlight speaker names</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="profanityFilter"
						type="checkbox"
						class="w-4 h-4 text-yellow-600 rounded"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Enable profanity filter</span>
				</label>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Preview
				</h4>
				<div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
					<div class="absolute inset-0 flex items-center justify-center">
						<Icon name="mdi:video" class="w-12 h-12 text-gray-700" />
					</div>
					<div
						:class="`absolute left-4 right-4 ${
							position === 'top'
								? 'top-4'
								: position === 'bottom'
								? 'bottom-4'
								: 'top-1/2 -translate-y-1/2'
						}`"
					>
						<div
							v-for="(sub, i) in sampleSubtitles.slice(0, maxLines).reverse()"
							:key="i"
							:class="`mb-1 ${
								style === 'classic'
									? 'bg-black/80 px-2 py-1'
									: style === 'modern'
									? 'bg-black/60 backdrop-blur px-3 py-2 rounded'
									: 'bg-transparent'
							}`"
						>
							<div
								v-if="highlightSpeaker"
								class="text-xs text-yellow-400 font-medium"
							>
								{{ sub.speaker }}
							</div>
							<div
								:class="`text-white ${style === 'minimal' ? 'text-shadow' : ''}`"
								:style="{ fontSize: `${fontSize}px` }"
							>
								{{ sub.text }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex gap-2">
				<button
					:class="`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
						isRecording
							? 'bg-red-600 hover:bg-red-700'
							: 'bg-yellow-600 hover:bg-yellow-700'
					} text-white`"
					@click="isRecording = !isRecording"
				>
					<Icon
						:name="isRecording ? 'mdi:stop' : 'mdi:microphone'"
						class="w-4 h-4"
					/>
					{{ isRecording ? "Stop Test" : "Test Recognition" }}
				</button>
				<button class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<Icon name="mdi:download" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
</template>
