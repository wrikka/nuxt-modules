<script setup lang="ts">
import {
	useAudio,
	useFocusMode,
	useKeyboardShortcuts,
	useMiniTimer,
	usePomodoroStats,
	useSettings,
	useTimer,
} from "#pomodoro"

const { state, start, pause, reset, skipPhase, nextPhase } = useTimer()
const { settings } = useSettings()
const { playSound } = useAudio()
const { toggleFocusMode, isFocusMode } = useFocusMode()
const { isMini, toggleMini, miniStyle, startDrag } = useMiniTimer()
const { recordSession } = usePomodoroStats()

const showHelp = ref(false)
const showSettings = ref(false)

const isRunning = computed(() => state.value === "running")

function handleStartPause() {
	if (isRunning.value) {
		pause()
	} else {
		start()
	}
}

function handleReset() {
	reset()
}

function handleSkip() {
	skipPhase()
}

function handleComplete() {
	recordSession(1, settings.value.workDuration)
	nextPhase(settings.value)
	playSound("complete", settings.value.volume)
}

useKeyboardShortcuts(
	handleStartPause,
	handleReset,
	handleSkip,
	toggleFocusMode,
	toggleMini,
	() => showHelp.value = !showHelp.value,
)

watch(state, (newState) => {
	if (newState === "completed") {
		handleComplete()
	}
})
</script>

<template>
	<div class="w-full max-w-2xl">
		<div class="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
			<WPomodoroStatusBadge class="mb-6" />

			<div class="mb-8 flex justify-center">
				<WPomodoroTimer />
			</div>

			<div class="mb-6 flex justify-center">
				<WPomodoroTimerControls />
			</div>

			<div class="mb-6">
				<WPomodoroStatsCard />
			</div>

			<div class="mb-6 grid gap-4 sm:grid-cols-2">
				<WPomodoroWeeklyChart />
				<WPomodoroSoundscapePlayer />
			</div>

			<div class="flex justify-center gap-4">
				<button
					class="rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
					@click="showSettings = !showSettings"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</button>

				<button
					class="rounded-lg bg-gray-100 p-3 transition-colors"
					:class="isFocusMode ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'"
					@click="toggleFocusMode"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</button>

				<button
					class="rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
					@click="showHelp = true"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</button>
			</div>

			<div v-if="showSettings" class="mt-6">
				<WPomodoroSettingsPanel />
			</div>
		</div>

		<WPomodoroMiniTimer
			v-if="isMini"
			v-bind="miniStyle"
			@mousedown="startDrag"
			@touchstart="startDrag"
		/>

		<WPomodoroFocusOverlay />

		<WPomodoroShortcutHelp
			v-if="showHelp"
			:on-start-pause="handleStartPause"
			:on-reset="handleReset"
			:on-skip="handleSkip"
			:on-focus-toggle="toggleFocusMode"
			:on-mini-toggle="toggleMini"
			@close="showHelp = false"
		/>
	</div>
</template>
