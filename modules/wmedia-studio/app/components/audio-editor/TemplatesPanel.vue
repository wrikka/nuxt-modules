<script setup lang="ts">
import type { AudioProjectTemplate } from "#shared/types/audio";

const emit = defineEmits<{
	apply: [template: AudioProjectTemplate];
}>();

const templates: AudioProjectTemplate[] = [
	{
		id: "podcast-basic",
		name: "Basic Podcast",
		category: "podcast",
		description: "Standard podcast setup with intro music and voice track",
		defaultTracks: ["Intro Music", "Voice", "Outro Music"],
		defaultEffects: ["Noise Gate", "Compressor", "EQ"],
	},
	{
		id: "podcast-interview",
		name: "Interview Podcast",
		category: "podcast",
		description: "Two-person interview with intro/outro and music ducking",
		defaultTracks: ["Intro Music", "Host", "Guest", "Outro Music"],
		defaultEffects: ["Noise Gate", "Compressor", "Sidechain"],
	},
	{
		id: "music-full",
		name: "Full Song Production",
		category: "music",
		description: "Complete band setup with all instruments",
		defaultTracks: [
			"Drums",
			"Bass",
			"Guitar",
			"Keys",
			"Vocals",
			"Backing Vocals",
		],
		defaultEffects: ["EQ", "Compression", "Reverb", "Delay"],
	},
	{
		id: "music-hiphop",
		name: "Hip Hop Beat",
		category: "music",
		description: "Beat-making template with drums, bass, and samples",
		defaultTracks: ["Kick", "Snare", "Hi-Hat", "808 Bass", "Sample", "Vocals"],
		defaultEffects: ["Compression", "EQ", "Distortion"],
	},
	{
		id: "voiceover",
		name: "Voice Over",
		category: "voiceover",
		description: "Clean voice over setup for narration",
		defaultTracks: ["Voice", "Background Music"],
		defaultEffects: ["De-esser", "Compressor", "Limiter"],
	},
	{
		id: "soundtrack",
		name: "Film Soundtrack",
		category: "soundtrack",
		description: "Cinematic scoring with orchestral sections",
		defaultTracks: ["Strings", "Brass", "Woodwinds", "Percussion", "Synth"],
		defaultEffects: ["Reverb", "EQ", "Compression"],
	},
];

const categories = [
	"all",
	"podcast",
	"music",
	"voiceover",
	"soundtrack",
] as const;
const selectedCategory = ref<typeof categories[number]>("all");

const filteredTemplates = computed(() => {
	if (selectedCategory.value === "all") return templates;
	return templates.filter(t => t.category === selectedCategory.value);
});

const applyTemplate = (template: AudioProjectTemplate) => {
	emit("apply", template);
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Project Templates</span>
		</div>

		<!-- Category Filter -->
		<div class="flex flex-wrap gap-2 mb-4">
			<button
				v-for="cat in categories"
				:key="cat"
				@click="selectedCategory = cat"
				:class="[
					'px-3 py-1 rounded text-xs transition-colors capitalize',
					selectedCategory === cat
						? 'bg-blue-600 text-white'
						: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
				]"
			>
				{{ cat }}
			</button>
		</div>

		<!-- Templates Grid -->
		<div class="grid grid-cols-1 gap-3">
			<div
				v-for="template in filteredTemplates"
				:key="template.id"
				class="bg-gray-800 rounded p-3 hover:bg-gray-700 transition-colors cursor-pointer"
				@click="applyTemplate(template)"
			>
				<div class="flex items-start justify-between mb-2">
					<div>
						<h3 class="text-sm font-medium text-gray-200">
							{{ template.name }}
						</h3>
						<span
							class="text-xs px-2 py-0.5 rounded mt-1 inline-block"
							:class="{
								'bg-purple-900/50 text-purple-300':
									template.category === 'podcast',
								'bg-blue-900/50 text-blue-300': template.category === 'music',
								'bg-green-900/50 text-green-300':
									template.category === 'voiceover',
								'bg-orange-900/50 text-orange-300':
									template.category === 'soundtrack',
							}"
						>
							{{ template.category }}
						</span>
					</div>
					<button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors">
						Use
					</button>
				</div>
				<p class="text-xs text-gray-500 mb-2">{{ template.description }}</p>

				<!-- Tracks Preview -->
				<div class="flex flex-wrap gap-1">
					<span
						v-for="track in template.defaultTracks.slice(0, 3)"
						:key="track"
						class="text-xs px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded"
					>
						{{ track }}
					</span>
					<span
						v-if="template.defaultTracks.length > 3"
						class="text-xs text-gray-500 px-1"
					>
						+{{ template.defaultTracks.length - 3 }} more
					</span>
				</div>

				<!-- Effects -->
				<div class="mt-2 flex flex-wrap gap-1">
					<span
						v-for="effect in template.defaultEffects"
						:key="effect"
						class="text-xs px-1.5 py-0.5 border border-gray-600 text-gray-400 rounded"
					>
						{{ effect }}
					</span>
				</div>
			</div>
		</div>

		<p class="mt-4 text-xs text-gray-500">
			Templates provide pre-configured track layouts and effect chains for
			common audio projects.
		</p>
	</div>
</template>
