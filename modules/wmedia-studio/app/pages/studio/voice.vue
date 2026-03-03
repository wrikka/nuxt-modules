<script setup lang="ts">
definePageMeta({
	layout: "default",
});

const activeTab = ref<
	"record" | "transcribe" | "clone" | "effects" | "dub" | "tts"
>("record");

const showBatchProcessor = ref(false);
const showStemSeparator = ref(false);
const showVoiceEnhancer = ref(false);
const showVoiceNormalizer = ref(false);
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					Voice Studio
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Record, edit, and enhance voice with AI-powered tools
				</p>
			</div>

			<!-- Tabs -->
			<div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
				<button
					v-for='tab in ["record", "transcribe", "clone", "effects", "dub", "tts"]'
					:key="tab"
					@click="activeTab = tab as any"
					:class="[
						'px-4 py-2 text-sm font-medium capitalize transition-colors',
						activeTab === tab
							? 'text-blue-600 border-b-2 border-blue-600'
							: 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
					]"
				>
					{{ tab }}
				</button>
			</div>

			<!-- Tools Bar -->
			<div class="flex flex-wrap gap-2 mb-6">
				<button
					class="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm"
					@click="showBatchProcessor = true"
				>
					<i class="i-mdi-layers mr-1" />Batch Process
				</button>
				<button
					class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
					@click="showStemSeparator = true"
				>
					<i class="i-mdi-music mr-1" />Stem Separation
				</button>
				<button
					class="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
					@click="showVoiceEnhancer = true"
				>
					<i class="i-mdi-magic mr-1" />Voice Enhancer
				</button>
				<button
					class="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm"
					@click="showVoiceNormalizer = true"
				>
					<i class="i-mdi-tune mr-1" />Voice Normalizer
				</button>
			</div>

			<!-- Content -->
			<div class="space-y-6">
				<VoiceRecorder v-if="activeTab === 'record'" />
				<VoiceTranscription v-if="activeTab === 'transcribe'" />
				<VoiceCloning v-if="activeTab === 'clone'" />
				<VoiceEffects v-if="activeTab === 'effects'" />
				<VoiceDubbing v-if="activeTab === 'dub'" />
				<TextToSpeech v-if="activeTab === 'tts'" />
			</div>

			<!-- Modals -->
			<VoiceBatchVoiceProcessor
				v-if="showBatchProcessor"
				@close="showBatchProcessor = false"
			/>
			<VoiceStemSeparator
				v-if="showStemSeparator"
				@close="showStemSeparator = false"
			/>
			<VoiceVoiceEnhancer
				v-if="showVoiceEnhancer"
				@close="showVoiceEnhancer = false"
			/>
			<VoiceVoiceNormalizer
				v-if="showVoiceNormalizer"
				@close="showVoiceNormalizer = false"
			/>
		</div>
	</div>
</template>
