<script setup lang="ts">
const { selectedClip, updateClip } = useAudioEditor();

const handleVolumeChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			volume: Number((event.target as HTMLInputElement).value),
		});
	}
};

const handleFadeInChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			fadeIn: Number((event.target as HTMLInputElement).value),
		});
	}
};

const handleFadeOutChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			fadeOut: Number((event.target as HTMLInputElement).value),
		});
	}
};

const handleReverbChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			effects: {
				...selectedClip.value.effects,
				reverb: Number((event.target as HTMLInputElement).value),
			},
		});
	}
};

const handleDelayChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			effects: {
				...selectedClip.value.effects,
				delay: Number((event.target as HTMLInputElement).value),
			},
		});
	}
};

const handleEqLowChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			effects: {
				...selectedClip.value.effects,
				eq: {
					...selectedClip.value.effects.eq,
					low: Number((event.target as HTMLInputElement).value),
				},
			},
		});
	}
};

const handleEqMidChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			effects: {
				...selectedClip.value.effects,
				eq: {
					...selectedClip.value.effects.eq,
					mid: Number((event.target as HTMLInputElement).value),
				},
			},
		});
	}
};

const handleEqHighChange = (event: Event) => {
	if (selectedClip.value) {
		updateClip(selectedClip.value.id, {
			effects: {
				...selectedClip.value.effects,
				eq: {
					...selectedClip.value.effects.eq,
					high: Number((event.target as HTMLInputElement).value),
				},
			},
		});
	}
};
</script>

<template>
	<div class="w-72 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Effects</span>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div v-if="selectedClip" class="space-y-6">
				<div>
					<label class="block text-gray-400 text-sm mb-1">Name</label>
					<input
						v-model="selectedClip.name"
						type="text"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-2">Volume</label>
					<div class="flex items-center gap-2">
						<input
							v-model.number="selectedClip.volume"
							type="range"
							min="0"
							max="2"
							step="0.01"
							class="flex-1 accent-blue-500"
							@input="handleVolumeChange"
						>
						<span class="text-gray-400 text-sm w-12">{{
								Math.round(selectedClip.volume * 100)
							}}%</span>
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-2">Fade In (s)</label>
					<div class="flex items-center gap-2">
						<input
							v-model.number="selectedClip.fadeIn"
							type="range"
							min="0"
							max="5"
							step="0.1"
							class="flex-1 accent-blue-500"
							@input="handleFadeInChange"
						>
						<span class="text-gray-400 text-sm w-12">{{
								selectedClip.fadeIn.toFixed(1)
							}}s</span>
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-2">Fade Out (s)</label>
					<div class="flex items-center gap-2">
						<input
							v-model.number="selectedClip.fadeOut"
							type="range"
							min="0"
							max="5"
							step="0.1"
							class="flex-1 accent-blue-500"
							@input="handleFadeOutChange"
						>
						<span class="text-gray-400 text-sm w-12">{{
								selectedClip.fadeOut.toFixed(1)
							}}s</span>
					</div>
				</div>

				<div class="border-t border-gray-700 pt-4">
					<h3 class="text-white text-sm font-medium mb-3">Effects</h3>

					<div class="space-y-4">
						<div>
							<label class="block text-gray-400 text-sm mb-2">Reverb</label>
							<div class="flex items-center gap-2">
								<input
									v-model.number="selectedClip.effects.reverb"
									type="range"
									min="0"
									max="1"
									step="0.01"
									class="flex-1 accent-blue-500"
									@input="handleReverbChange"
								>
								<span class="text-gray-400 text-sm w-12">{{
										Math.round(selectedClip.effects.reverb * 100)
									}}%</span>
							</div>
						</div>

						<div>
							<label class="block text-gray-400 text-sm mb-2">Delay</label>
							<div class="flex items-center gap-2">
								<input
									v-model.number="selectedClip.effects.delay"
									type="range"
									min="0"
									max="1"
									step="0.01"
									class="flex-1 accent-blue-500"
									@input="handleDelayChange"
								>
								<span class="text-gray-400 text-sm w-12">{{
										Math.round(selectedClip.effects.delay * 100)
									}}%</span>
							</div>
						</div>

						<div>
							<label class="block text-gray-400 text-sm mb-2">Equalizer</label>
							<div class="space-y-2">
								<div class="flex items-center gap-2">
									<span class="text-gray-500 text-xs w-8">Low</span>
									<input
										v-model.number="selectedClip.effects.eq.low"
										type="range"
										min="-12"
										max="12"
										step="0.5"
										class="flex-1 accent-blue-500"
										@input="handleEqLowChange"
									>
									<span class="text-gray-400 text-xs w-8">{{
											selectedClip.effects.eq.low.toFixed(1)
										}}dB</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-gray-500 text-xs w-8">Mid</span>
									<input
										v-model.number="selectedClip.effects.eq.mid"
										type="range"
										min="-12"
										max="12"
										step="0.5"
										class="flex-1 accent-blue-500"
										@input="handleEqMidChange"
									>
									<span class="text-gray-400 text-xs w-8">{{
											selectedClip.effects.eq.mid.toFixed(1)
										}}dB</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-gray-500 text-xs w-8">High</span>
									<input
										v-model.number="selectedClip.effects.eq.high"
										type="range"
										min="-12"
										max="12"
										step="0.5"
										class="flex-1 accent-blue-500"
										@input="handleEqHighChange"
									>
									<span class="text-gray-400 text-xs w-8">{{
											selectedClip.effects.eq.high.toFixed(1)
										}}dB</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				v-else
				class="flex items-center justify-center h-full text-gray-500 text-sm"
			>
				Select a clip to edit effects
			</div>
		</div>
	</div>
</template>
