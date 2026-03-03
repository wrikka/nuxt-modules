<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
	note: string;
}

const props = defineProps<Props>();

const isExpanded = ref(false);
const fontSize = ref(16);

const canIncrease = computed(() => fontSize.value < 32);
const canDecrease = computed(() => fontSize.value > 12);

function increaseFont() {
	if (canIncrease.value) {
		fontSize.value += 2;
	}
}

function decreaseFont() {
	if (canDecrease.value) {
		fontSize.value -= 2;
	}
}
</script>

<template>
	<div class="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl z-90">
		<div
			class="flex items-center justify-between px-4 py-3 cursor-pointer border-t border-white/10 text-sm font-medium hover:bg-white/5"
			@click="isExpanded = !isExpanded"
		>
			<span>Presenter Notes</span>
			<div class="flex items-center gap-2">
				<button
					v-if="isExpanded"
					class="w-7 h-7 flex items-center justify-center bg-white/10 border-none text-white cursor-pointer rounded text-xs font-semibold transition-colors hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
					:disabled="!canDecrease"
					@click.stop="decreaseFont"
				>
					A-
				</button>
				<button
					v-if="isExpanded"
					class="w-7 h-7 flex items-center justify-center bg-white/10 border-none text-white cursor-pointer rounded text-xs font-semibold transition-colors hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
					:disabled="!canIncrease"
					@click.stop="increaseFont"
				>
					A+
				</button>
				<svg
					class="w-4 h-4 transition-transform"
					:class="{ 'rotate-180': isExpanded }"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</div>
		</div>

		<Transition name="notes">
			<div
				v-if="isExpanded"
				class="px-4 py-4 leading-relaxed max-h-[30vh] overflow-y-auto whitespace-pre-wrap"
				:style="{ fontSize: fontSize + 'px' }"
			>
				{{ note }}
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.notes-enter-active,
.notes-leave-active {
	@apply transition-all duration-200 ease-out;
}

.notes-enter-from,
.notes-leave-to {
	@apply opacity-0 translate-y-2;
}
</style>
