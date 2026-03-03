<script setup lang="ts">
const emit = defineEmits<{ close: []; apply: [theme: any] }>();
const theme = ref({
	primary: "#3b82f6",
	secondary: "#8b5cf6",
	accent: "#22c55e",
	darkMode: true,
	fontSize: "medium",
	borderRadius: "medium",
});
const presets = [{
	name: "Ocean",
	colors: { primary: "#0ea5e9", secondary: "#6366f1", accent: "#14b8a6" },
}, {
	name: "Sunset",
	colors: { primary: "#f97316", secondary: "#ec4899", accent: "#eab308" },
}, {
	name: "Forest",
	colors: { primary: "#22c55e", secondary: "#16a34a", accent: "#84cc16" },
}];
const applyPreset = (p: typeof presets[0]) => {
	theme.value.primary = p.colors.primary;
	theme.value.secondary = p.colors.secondary;
	theme.value.accent = p.colors.accent;
};
const apply = () => emit("apply", theme.value);
</script>
<template>
	<div class="theme-customizer bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:palette" class="w-5 h-5 text-blue-500" />
				Theme Customizer
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Presets</label>
			<div class="flex gap-2">
				<button
					v-for="p in presets"
					:key="p.name"
					class="flex-1 p-2 rounded-lg text-center text-sm text-white font-medium transition-all"
					:class="theme.primary === p.colors.primary
					? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-400'
					: ''"
					:style="{
						background:
							`linear-gradient(135deg, ${p.colors.primary}, ${p.colors.secondary})`,
					}"
					@click="applyPreset(p)"
				>
					{{ p.name }}
				</button>
			</div>
		</div>
		<div class="space-y-3 mb-4">
			<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
				<span class="text-gray-700 dark:text-gray-300 text-sm">Primary</span>
				<input
					v-model="theme.primary"
					type="color"
					class="w-8 h-8 rounded cursor-pointer border-0"
				/>
			</div>
			<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
				<span class="text-gray-700 dark:text-gray-300 text-sm">Secondary</span>
				<input
					v-model="theme.secondary"
					type="color"
					class="w-8 h-8 rounded cursor-pointer border-0"
				/>
			</div>
			<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
				<span class="text-gray-700 dark:text-gray-300 text-sm">Accent</span>
				<input
					v-model="theme.accent"
					type="color"
					class="w-8 h-8 rounded cursor-pointer border-0"
				/>
			</div>
			<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
				<span class="text-gray-900 dark:text-white text-sm font-medium"
				>Dark Mode</span>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="theme.darkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
					@click="theme.darkMode = !theme.darkMode"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="theme.darkMode ? 'left-7' : 'left-1'"
					/>
				</button>
			</div>
		</div>
		<div class="mb-4 p-3 rounded-lg" :style="{ background: theme.primary }">
			<div class="text-white text-sm font-medium">Preview</div>
			<div class="text-white/80 text-xs">
				Sample text with <span :style="{ color: theme.accent }"
				>accent color</span>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="apply"
		>
			Apply Theme
		</button>
	</div>
</template>
