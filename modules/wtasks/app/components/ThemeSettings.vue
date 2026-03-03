<script setup lang="ts">
const { theme, isDark, accentColor, availableThemes, accentColors, setTheme, setAccentColor, toggleHighContrast, highContrast } = useTheme()

const showThemePicker = ref(false)
</script>

<template>
	<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>

		<!-- Theme Selection -->
		<div class="mb-6">
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
			<div class="grid grid-cols-3 gap-3">
				<button
					v-for="t in availableThemes"
					:key="t.id"
					class="flex items-center gap-3 p-3 border rounded-lg transition-colors"
					:class="theme === t.id
						? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
						: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
					@click="setTheme(t.id)"
				>
					<div
						class="w-6 h-6 rounded"
						:style="{ backgroundColor: t.colors.bg }"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300">{{ t.name }}</span>
					<Icon
						v-if="theme === t.id"
						name="mdi:check"
						class="w-4 h-4 text-blue-500 ml-auto"
					/>
				</button>
			</div>
		</div>

		<!-- Accent Color -->
		<div class="mb-6">
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</h3>
			<div class="flex gap-3 flex-wrap">
				<button
					v-for="color in accentColors"
					:key="color.value"
					class="w-10 h-10 rounded-full border-2 transition-transform hover:scale-110"
					:class="accentColor === color.value ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'"
					:style="{ backgroundColor: color.value }"
					:title="color.name"
					@click="setAccentColor(color.value)"
				/>
			</div>
		</div>

		<!-- Accessibility -->
		<div>
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accessibility</h3>
			<label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
				<input
					type="checkbox"
					:checked="highContrast"
					class="w-4 h-4"
					@change="toggleHighContrast"
				>
				<div>
					<p class="text-sm font-medium text-gray-900 dark:text-white">High Contrast Mode</p>
					<p class="text-xs text-gray-500">Increase contrast for better visibility</p>
				</div>
			</label>
		</div>
	</div>
</template>
