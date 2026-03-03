<script setup lang="ts">
const emit = defineEmits<{ close: []; apply: [crop: any] }>();
const suggestions = ref([
	{ id: 1, name: "Rule of Thirds", preview: "grid", confidence: 95 },
	{ id: 2, name: "Golden Ratio", preview: "spiral", confidence: 88 },
	{ id: 3, name: "Center Focus", preview: "center", confidence: 82 },
]);
const selectedCrop = ref(1);
const customAspect = ref("16:9");
const rotation = ref(0);

const apply = () => {
	const crop = suggestions.value.find(s => s.id === selectedCrop.value);
	emit("apply", crop);
};
</script>
<template>
	<div class="smart-crop-suggestions bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:crop" class="w-5 h-5 text-purple-500" />
				Smart Crop Suggestions
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Image Preview
			</div>
			<div
				v-if="selectedCrop"
				class="absolute inset-0 border-2 border-purple-500/50"
			>
				<div class="absolute top-0 left-1/3 w-px h-full bg-purple-500/30" />
				<div class="absolute top-0 left-2/3 w-px h-full bg-purple-500/30" />
				<div class="absolute top-1/3 left-0 w-full h-px bg-purple-500/30" />
				<div class="absolute top-2/3 left-0 w-full h-px bg-purple-500/30" />
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>AI Suggestions</label>
			<div class="space-y-2">
				<button
					v-for="s in suggestions"
					:key="s.id"
					class="w-full p-3 rounded-lg flex items-center justify-between transition-all"
					:class="selectedCrop === s.id
					? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
					: 'bg-gray-50 dark:bg-gray-700/50'"
					@click="selectedCrop = s.id"
				>
					<div class="flex items-center gap-3">
						<Icon
							:name="selectedCrop === s.id ? 'mdi:check-circle' : 'mdi:circle'"
							:class="[
								selectedCrop === s.id ? 'text-purple-500' : 'text-gray-400',
								'w-5 h-5',
							]"
						/>
						<span class="text-gray-900 dark:text-white text-sm">{{
							s.name
						}}</span>
					</div>
					<span class="text-purple-500 text-xs font-medium">{{ s.confidence }}%
						match</span>
				</button>
			</div>
		</div>
		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Rotation</span>
				<span class="text-blue-500 font-medium">{{ rotation }}°</span>
			</div>
			<input
				v-model="rotation"
				type="range"
				min="-45"
				max="45"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			/>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="apply"
		>
			Apply Crop
		</button>
	</div>
</template>
