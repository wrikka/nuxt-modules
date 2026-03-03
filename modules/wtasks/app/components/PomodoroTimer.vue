<script setup lang="ts">
const {
	isRunning,
	isPaused,
	timeRemaining,
	currentMode,
	completedPomodoros,
	isFocusMode,
	progress,
	start,
	pause,
	resume,
	stop,
	reset,
	complete,
	switchMode,
	toggleFocusMode,
	formatTime,
} = usePomodoro()

const showFocusMode = ref(false)

const toggleFullScreen = () => {
	toggleFocusMode()
	showFocusMode.value = isFocusMode.value
}

const modeLabels = {
	work: "Focus Time",
	shortBreak: "Short Break",
	longBreak: "Long Break",
}

const modeColors = {
	work: "bg-red-500",
	shortBreak: "bg-green-500",
	longBreak: "bg-blue-500",
}
</script>

<template>
	<div>
		<!-- Mini Timer -->
		<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">{{ modeLabels[currentMode] }}</h3>
					<p class="text-sm text-gray-500">{{ completedPomodoros }} pomodoros completed</p>
				</div>
				<button
					class="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="toggleFullScreen"
				>
					<Icon name="mdi:fullscreen" class="w-5 h-5" />
				</button>
			</div>

			<!-- Progress Ring -->
			<div class="flex items-center justify-center mb-4">
				<div class="relative w-32 h-32">
					<svg class="w-full h-full -rotate-90">
						<circle
							cx="64"
							cy="64"
							r="56"
							stroke="#e5e7eb"
							stroke-width="8"
							fill="none"
						/>
						<circle
							cx="64"
							cy="64"
							r="56"
							stroke="currentColor"
							stroke-width="8"
							fill="none"
							stroke-linecap="round"
							class="transition-all duration-1000"
							:stroke-dasharray="351.86"
							:stroke-dashoffset="351.86 * (1 - progress / 100)"
							:class="modeColors[currentMode]"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatTime() }}</span>
					</div>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center justify-center gap-2">
				<button
					v-if="!isRunning && !isPaused"
					class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
					@click="start"
				>
					<Icon name="mdi:play" class="w-5 h-5" />
				</button>
				<template v-else>
					<button
						v-if="isPaused"
						class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
						@click="resume"
					>
						<Icon name="mdi:play" class="w-5 h-5" />
					</button>
					<button
						v-else
						class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
						@click="pause"
					>
						<Icon name="mdi:pause" class="w-5 h-5" />
					</button>
				</template>
				<button
					class="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="stop"
				>
					<Icon name="mdi:stop" class="w-5 h-5" />
				</button>
				<button
					class="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
					@click="reset"
				>
					<Icon name="mdi:refresh" class="w-5 h-5" />
				</button>
			</div>

			<!-- Mode Switcher -->
			<div class="flex gap-2 mt-4 justify-center">
				<button
					v-for="(label, mode) in modeLabels"
					:key="mode"
					class="px-3 py-1 text-xs rounded-full"
					:class="currentMode === mode
						? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800'
						: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'"
					@click="switchMode(mode as typeof currentMode)"
				>
					{{ label }}
				</button>
			</div>
		</div>

		<!-- Full Screen Focus Mode -->
		<div
			v-if="showFocusMode"
			class="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center"
		>
			<button
				class="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
				@click="toggleFullScreen"
			>
				<Icon name="mdi:close" class="w-8 h-8" />
			</button>

			<div class="text-center">
				<p class="text-white/60 text-xl mb-4">{{ modeLabels[currentMode] }}</p>
				<div class="text-8xl font-bold text-white mb-8">{{ formatTime() }}</div>

				<div class="flex items-center justify-center gap-4">
					<button
						v-if="!isRunning"
						class="px-8 py-4 bg-white text-gray-900 rounded-full text-xl hover:bg-gray-100"
						@click="start"
					>
						<Icon name="mdi:play" class="w-8 h-8" />
					</button>
					<button
						v-else
						class="px-8 py-4 bg-white text-gray-900 rounded-full text-xl hover:bg-gray-100"
						@click="pause"
					>
						<Icon name="mdi:pause" class="w-8 h-8" />
					</button>
				</div>
			</div>

			<p class="absolute bottom-8 text-white/40">Press ESC to exit focus mode</p>
		</div>
	</div>
</template>
