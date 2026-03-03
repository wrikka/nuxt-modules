<script setup lang="ts">
const colorMode = useColorMode();
const accentColor = ref("#3B82F6");

const accentColors = [
	{ name: "Blue", value: "#3B82F6", class: "bg-blue-500" },
	{ name: "Purple", value: "#8B5CF6", class: "bg-purple-500" },
	{ name: "Green", value: "#10B981", class: "bg-green-500" },
	{ name: "Orange", value: "#F59E0B", class: "bg-orange-500" },
	{ name: "Pink", value: "#EC4899", class: "bg-pink-500" },
	{ name: "Red", value: "#EF4444", class: "bg-red-500" },
];

const setAccentColor = (color: typeof accentColors[0]) => {
	accentColor.value = color.value;
};

const previewStyles = computed(() => ({
	"--accent-color": accentColor.value,
	backgroundColor: colorMode.value === "dark" ? "#1f2937" : "#ffffff",
	color: colorMode.value === "dark" ? "#ffffff" : "#1f2937",
}));
</script>

<template>
	<div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
		<h3 class="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
			Appearance
		</h3>

		<!-- Theme Toggle -->
		<div class="mb-6">
			<label class="text-sm text-gray-600 dark:text-gray-400 mb-2 block"
			>Theme Mode</label>
			<div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
				<button
					:class="[
						'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors',
						colorMode.value === 'light'
							? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white'
							: 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
					]"
					@click="colorMode.preference = 'light'"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
					Light
				</button>
				<button
					:class="[
						'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors',
						colorMode.value === 'dark'
							? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white'
							: 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
					]"
					@click="colorMode.preference = 'dark'"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
					Dark
				</button>
				<button
					:class="[
						'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors',
						colorMode.value === 'system'
							? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white'
							: 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
					]"
					@click="colorMode.preference = 'system'"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
					Auto
				</button>
			</div>
			<p v-if="colorMode.value === 'system'" class="text-xs text-gray-500 mt-2">
				Automatically switches based on your system preference
			</p>
		</div>

		<!-- Accent Color Picker -->
		<div class="mb-4">
			<label class="text-sm text-gray-600 dark:text-gray-400 mb-2 block"
			>Accent Color</label>
			<div class="flex gap-2 flex-wrap">
				<button
					v-for="color in accentColors"
					:key="color.value"
					:class="[
						'w-8 h-8 rounded-full transition-all',
						color.class,
						accentColor === color.value
							? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
							: 'hover:scale-105',
					]"
					:title="color.name"
					@click="setAccentColor(color)"
				/>
				<input
					v-model="accentColor"
					type="color"
					class="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
					title="Custom color"
				/>
			</div>
		</div>

		<!-- Preview -->
		<div
			class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
			:style="previewStyles"
		>
			<p class="text-sm font-medium mb-2">Preview</p>
			<div class="flex gap-2">
				<button
					class="px-3 py-1.5 rounded text-sm text-white"
					:style="{ backgroundColor: accentColor }"
				>
					Primary Button
				</button>
				<button
					class="px-3 py-1.5 rounded text-sm border"
					:style="{ borderColor: accentColor, color: accentColor }"
				>
					Secondary
				</button>
			</div>
		</div>
	</div>
</template>
