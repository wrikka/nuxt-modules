<script setup lang="ts">
import { useAutoplay } from "../../composables/useAutoplay";

const props = defineProps<{
	onNext: () => void;
}>();

const autoplay = useAutoplay();
</script>

<template>
	<div
		v-if="autoplay.isEnabled.value"
		class="fixed top-1/2 right-4 z-40 -translate-y-1/2"
	>
		<div class="bg-black/70 backdrop-blur-md text-white p-3 rounded-lg">
			<div class="flex items-center gap-2 mb-2">
				<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
				<span class="text-sm font-medium">Autoplay</span>
			</div>
			<div class="text-xs text-gray-300 mb-2">{{ autoplay.formattedDelay.value }} / slide</div>
			<div class="flex gap-1">
				<button
					class="p-1.5 hover:bg-white/20 rounded transition-colors"
					@click="autoplay.setDelay(autoplay.delay.value - 1000)"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 5v14M5 12h14" />
					</svg>
				</button>
				<button
					class="p-1.5 hover:bg-white/20 rounded transition-colors"
					@click="autoplay.stop()"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
						<rect x="6" y="4" width="4" height="16" />
						<rect x="14" y="4" width="4" height="16" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>
