<script setup lang="ts">
import { useSettings } from "#pomodoro"

const { settings, updateDurations, updateAutoStart, updateAudio, resetToDefaults } = useSettings()

const workDuration = computed({
	get: () => settings.value.workDuration,
	set: (val) => updateDurations(val, settings.value.shortBreakDuration, settings.value.longBreakDuration),
})

const shortBreakDuration = computed({
	get: () => settings.value.shortBreakDuration,
	set: (val) => updateDurations(settings.value.workDuration, val, settings.value.longBreakDuration),
})

const longBreakDuration = computed({
	get: () => settings.value.longBreakDuration,
	set: (val) => updateDurations(settings.value.workDuration, settings.value.shortBreakDuration, val),
})

const longBreakInterval = computed({
	get: () => settings.value.longBreakInterval,
	set: (val) => updateSettings({ longBreakInterval: val }),
})
</script>

<template>
	<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
		<h3 class="mb-6 text-lg font-semibold">Pomodoro Settings</h3>

		<div class="space-y-6">
			<div>
				<h4 class="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">Durations (minutes)</h4>
				<div class="grid gap-4 sm:grid-cols-3">
					<div>
						<label class="mb-2 block text-sm">Work</label>
						<input
							v-model="workDuration"
							type="number"
							min="1"
							max="60"
							class="w-full rounded-lg border px-3 py-2"
						/>
					</div>
					<div>
						<label class="mb-2 block text-sm">Short Break</label>
						<input
							v-model="shortBreakDuration"
							type="number"
							min="1"
							max="30"
							class="w-full rounded-lg border px-3 py-2"
						/>
					</div>
					<div>
						<label class="mb-2 block text-sm">Long Break</label>
						<input
							v-model="longBreakDuration"
							type="number"
							min="1"
							max="60"
							class="w-full rounded-lg border px-3 py-2"
						/>
					</div>
				</div>
			</div>

			<div>
				<label class="mb-2 block text-sm">Long Break Interval (pomodoros)</label>
				<input
					v-model="longBreakInterval"
					type="number"
					min="1"
					max="10"
					class="w-full rounded-lg border px-3 py-2"
				/>
			</div>

			<div class="space-y-3">
				<h4 class="text-sm font-medium text-gray-600 dark:text-gray-400">Auto-start Options</h4>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						:checked="settings.autoStartBreaks"
						@change="updateAutoStart(!settings.autoStartBreaks, settings.autoStartPomodoros)"
						class="h-4 w-4"
					/>
					<span class="text-sm">Auto-start breaks</span>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						:checked="settings.autoStartPomodoros"
						@change="updateAutoStart(settings.autoStartBreaks, !settings.autoStartPomodoros)"
						class="h-4 w-4"
					/>
					<span class="text-sm">Auto-start pomodoros</span>
				</label>
			</div>

			<div class="space-y-3">
				<h4 class="text-sm font-medium text-gray-600 dark:text-gray-400">Audio & Notifications</h4>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						:checked="settings.enableAudio"
						@change="updateAudio(!settings.enableAudio, settings.volume)"
						class="h-4 w-4"
					/>
					<span class="text-sm">Enable audio</span>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						:checked="settings.enableNotifications"
						@change="updateSettings({ enableNotifications: !settings.enableNotifications })"
						class="h-4 w-4"
					/>
					<span class="text-sm">Enable notifications</span>
				</label>
				<div v-if="settings.enableAudio">
					<label class="block text-sm">Volume</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						:value="settings.volume"
						@input="(e) => updateAudio(true, Number((e.target as HTMLInputElement).value))"
						class="w-full"
					/>
				</div>
			</div>

			<button
				class="w-full rounded-lg bg-gray-200 py-2 text-sm font-medium transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
				@click="resetToDefaults"
			>
				Reset to Defaults
			</button>
		</div>
	</div>
</template>
