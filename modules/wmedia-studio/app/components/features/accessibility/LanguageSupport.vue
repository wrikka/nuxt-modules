<script setup lang="ts">
const languages = ref([
	{ code: "en", name: "English", flag: "🇺🇸", active: true, progress: 100 },
	{ code: "th", name: "Thai", flag: "🇹🇭", active: true, progress: 95 },
	{ code: "ja", name: "Japanese", flag: "🇯🇵", active: false, progress: 0 },
	{ code: "ko", name: "Korean", flag: "🇰🇷", active: false, progress: 0 },
	{ code: "zh", name: "Chinese", flag: "🇨🇳", active: false, progress: 0 },
	{ code: "es", name: "Spanish", flag: "🇪🇸", active: false, progress: 0 },
]);

const currentLang = ref("en");
const autoTranslate = ref(false);

const toggleLanguage = (lang: any) => {
	lang.active = !lang.active;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Language Support
			</h3>
			<div class="flex items-center gap-2">
				<span class="text-sm text-gray-500">Auto-translate</span>
				<button
					@click="autoTranslate = !autoTranslate"
					:class="autoTranslate ? 'bg-blue-500' : 'bg-gray-300'"
					class="w-12 h-6 rounded-full relative transition-colors"
				>
					<span
						:class="autoTranslate ? 'translate-x-6' : 'translate-x-1'"
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
					/>
				</button>
			</div>
		</div>

		<!-- Current Language -->
		<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
			<p class="text-sm text-gray-500 mb-1">Current Interface Language</p>
			<div class="flex items-center gap-2">
				<span class="text-2xl">{{
					languages.find(l => l.code === currentLang)?.flag
				}}</span>
				<span class="font-medium">{{
					languages.find(l => l.code === currentLang)?.name
				}}</span>
			</div>
		</div>

		<!-- Language List -->
		<div class="space-y-2">
			<div
				v-for="lang in languages"
				:key="lang.code"
				class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<div class="flex items-center gap-3">
					<span class="text-xl">{{ lang.flag }}</span>
					<div>
						<p class="font-medium text-sm">{{ lang.name }}</p>
						<div v-if="lang.progress > 0" class="flex items-center gap-2">
							<div class="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
								<div
									class="h-full bg-green-500"
									:style="{ width: `${lang.progress}%` }"
								/>
							</div>
							<span class="text-xs text-gray-500">{{ lang.progress }}%</span>
						</div>
					</div>
				</div>
				<button
					@click="toggleLanguage(lang)"
					:class="lang.active ? 'bg-green-500' : 'bg-gray-300'"
					class="w-12 h-6 rounded-full relative transition-colors"
				>
					<span
						:class="lang.active ? 'translate-x-6' : 'translate-x-1'"
						class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
					/>
				</button>
			</div>
		</div>
	</div>
</template>
