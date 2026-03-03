<script setup lang="ts">
import { useFocusMode, useTimer } from "#pomodoro"

const { isFocusMode, disableFocusMode } = useFocusMode()
const { formattedTime, phase } = useTimer()

const phaseLabel = computed(() => {
	if (phase.value === "work") return "🍅 Focus Time"
	if (phase.value === "shortBreak") return "☕ Short Break"
	return "🌴 Long Break"
})
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="isFocusMode"
				class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/98"
			>
				<div class="text-center">
					<div class="mb-8 text-8xl font-bold text-white tabular-nums">
						{{ formattedTime }}
					</div>
					<div class="mb-8 text-2xl text-gray-400">
						{{ phaseLabel }}
					</div>
					<button
						class="rounded-full bg-white/10 px-8 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
						@click="disableFocusMode"
					>
						Exit Focus Mode (F)
					</button>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
