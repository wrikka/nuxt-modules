<script setup lang="ts">
const emit = defineEmits<{ close: []; save: [prefs: any] }>();
const prefs = ref({
	language: "th",
	autoSave: true,
	notifications: true,
	betaFeatures: false,
});
const languages = [{ id: "th", name: "Thai" }, { id: "en", name: "English" }, {
	id: "ja",
	name: "Japanese",
}];
const save = () => emit("save", prefs.value);
</script>
<template>
	<div class="system-preferences bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:cog" class="w-5 h-5 text-blue-500" />
				Preferences
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="space-y-4 mb-4">
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Language</label>
				<select
					v-model="prefs.language"
					class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
					<option v-for="l in languages" :key="l.id" :value="l.id">
						{{ l.name }}
					</option>
				</select>
			</div>
			<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
				<span class="text-gray-900 dark:text-white text-sm font-medium"
				>Auto Save</span>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="prefs.autoSave ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
					@click="prefs.autoSave = !prefs.autoSave"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="prefs.autoSave ? 'left-7' : 'left-1'"
					/>
				</button>
			</div>
			<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
				<span class="text-gray-900 dark:text-white text-sm font-medium"
				>Notifications</span>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="prefs.notifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
					@click="prefs.notifications = !prefs.notifications"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="prefs.notifications ? 'left-7' : 'left-1'"
					/>
				</button>
			</div>
			<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
				<span class="text-gray-900 dark:text-white text-sm font-medium"
				>Beta Features</span>
				<button
					class="relative w-12 h-6 rounded-full transition-colors"
					:class="prefs.betaFeatures ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
					@click="prefs.betaFeatures = !prefs.betaFeatures"
				>
					<div
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
						:class="prefs.betaFeatures ? 'left-7' : 'left-1'"
					/>
				</button>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="save"
		>
			Save Preferences
		</button>
	</div>
</template>
