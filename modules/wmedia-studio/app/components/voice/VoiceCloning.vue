<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	cloneVoice: [voiceId: string];
	synthesize: [text: string, voiceId: string];
}>();

const selectedVoice = ref("original");
const textToSynthesize = ref("");
const isCloning = ref(false);
const cloneProgress = ref(0);
const clonedVoices = ref([
	{ id: "original", name: "Original Voice", isCloned: false },
	{
		id: "clone1",
		name: "My Cloned Voice #1",
		isCloned: true,
		createdAt: "2024-01-10",
	},
]);

const sampleScripts = [
	"สวัสดีครับ นี่คือเสียงที่สังเคราะห์ขึ้นจาก AI",
	"Hello, this is an AI-generated voice sample.",
	"The quick brown fox jumps over the lazy dog.",
	"ในเมืองหลวงที่แสนวุ่นวาย มีเรื่องราวมากมายเกิดขึ้นทุกวัน",
];

const startCloning = () => {
	isCloning.value = true;
	cloneProgress.value = 0;

	const interval = setInterval(() => {
		cloneProgress.value += 10;
		if (cloneProgress.value >= 100) {
			clearInterval(interval);
			isCloning.value = false;
			clonedVoices.value.push({
				id: `clone${Date.now()}`,
				name: `My Cloned Voice #${clonedVoices.value.length}`,
				isCloned: true,
				createdAt: new Date().toISOString().split("T")[0],
			});
		}
	}, 300);
};

const synthesize = () => {
	if (!textToSynthesize.value.trim()) return;
	emit("synthesize", textToSynthesize.value, selectedVoice.value);
};

const deleteClonedVoice = (voiceId: string) => {
	clonedVoices.value = clonedVoices.value.filter(v => v.id !== voiceId);
};
</script>

<template>
	<div class="voice-cloning bg-gray-800 rounded-lg p-4 w-[500px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-fingerprint" class="w-5 h-5" />
				AI Voice Cloning
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<!-- Clone New Voice -->
		<div class="mb-4 p-3 bg-gray-700/50 rounded-lg">
			<h4 class="text-white text-sm font-medium mb-2">Clone New Voice</h4>
			<p class="text-gray-400 text-xs mb-3">
				Record or upload 30 seconds of clear speech to create your voice clone.
			</p>

			<div v-if="isCloning" class="mb-3">
				<div class="flex items-center justify-between text-sm mb-1">
					<span class="text-gray-300">Processing...</span>
					<span class="text-blue-400">{{ cloneProgress }}%</span>
				</div>
				<div class="h-2 bg-gray-600 rounded-full overflow-hidden">
					<div
						class="h-full bg-blue-500 rounded-full transition-all"
						:style="{ width: `${cloneProgress}%` }"
					/>
				</div>
			</div>

			<div class="flex gap-2">
				<button class="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm flex items-center justify-center gap-2">
					<Icon name="i-ph-microphone" class="w-4 h-4" />
					Record
				</button>
				<button class="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm flex items-center justify-center gap-2">
					<Icon name="i-ph-upload" class="w-4 h-4" />
					Upload
				</button>
				<button
					class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
					:disabled="isCloning"
					@click="startCloning"
				>
					Clone Voice
				</button>
			</div>
		</div>

		<!-- Cloned Voices -->
		<div class="mb-4">
			<h4 class="text-gray-300 text-sm mb-2">Your Voices</h4>
			<div class="space-y-2">
				<div
					v-for="voice in clonedVoices"
					:key="voice.id"
					class="flex items-center gap-3 p-2 rounded-lg"
					:class="selectedVoice === voice.id
					? 'bg-blue-600/30 ring-1 ring-blue-500'
					: 'bg-gray-700/30'"
				>
					<div class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
						<Icon
							:name="voice.isCloned ? 'i-ph-robot' : 'i-ph-user'"
							class="w-5 h-5 text-gray-400"
						/>
					</div>
					<div class="flex-1">
						<div class="text-white text-sm">{{ voice.name }}</div>
						<div v-if="voice.isCloned" class="text-gray-500 text-xs">
							Created {{ voice.createdAt }}
						</div>
						<div v-else class="text-gray-500 text-xs">Original voice</div>
					</div>
					<button
						class="px-3 py-1 text-xs rounded-lg transition-colors"
						:class="selectedVoice === voice.id
						? 'bg-blue-600 text-white'
						: 'bg-gray-600 text-gray-300 hover:bg-gray-500'"
						@click="selectedVoice = voice.id"
					>
						Select
					</button>
					<button
						v-if="voice.isCloned"
						class="p-1 text-gray-500 hover:text-red-400"
						@click="deleteClonedVoice(voice.id)"
					>
						<Icon name="i-ph-trash" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Synthesize -->
		<div class="flex-1">
			<h4 class="text-gray-300 text-sm mb-2">Synthesize Speech</h4>
			<textarea
				v-model="textToSynthesize"
				placeholder="Enter text to convert to speech..."
				class="w-full h-24 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm resize-none mb-2"
			/>
			<div class="flex flex-wrap gap-1 mb-3">
				<button
					v-for="script in sampleScripts"
					:key="script"
					class="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs"
					@click="textToSynthesize = script"
				>
					{{ script.slice(0, 20) }}...
				</button>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
				:disabled="!textToSynthesize.trim()"
				@click="synthesize"
			>
				<Icon name="i-ph-speaker-high" class="w-4 h-4" />
				Synthesize
			</button>
		</div>
	</div>
</template>
