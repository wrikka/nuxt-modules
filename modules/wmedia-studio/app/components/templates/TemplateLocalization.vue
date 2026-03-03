<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(
		e: "translate",
		language: string,
		translations: Record<string, string>,
	): void;
}>();

const targetLanguage = ref("es");
const showPreview = ref(false);
const translations = ref<Record<string, string>>({
	title: "",
	description: "",
	cta: "",
	footer: "",
});

const languages = [
	{ code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
	{ code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
	{ code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
	{ code: "it", name: "Italian", flag: "🇮🇹", native: "Italiano" },
	{ code: "pt", name: "Portuguese", flag: "🇵🇹", native: "Português" },
	{ code: "zh", name: "Chinese", flag: "🇨🇳", native: "中文" },
	{ code: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" },
	{ code: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
	{ code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية" },
	{ code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
	{ code: "ru", name: "Russian", flag: "🇷🇺", native: "Русский" },
	{ code: "nl", name: "Dutch", flag: "🇳🇱", native: "Nederlands" },
];

const autoTranslateFields = ["title", "description", "cta", "footer"];
const selectedFields = ref<string[]>(["title", "description"]);

const isTranslating = ref(false);
const progress = ref(0);

const startTranslation = async () => {
	isTranslating.value = true;
	progress.value = 0;

	for (let i = 0; i <= 100; i += 20) {
		await new Promise(r => setTimeout(r, 200));
		progress.value = i;
	}

	// Mock translations
	const lang = languages.find(l => l.code === targetLanguage.value);
	translations.value = {
		title: lang?.code === "es"
			? "Título de Ejemplo"
			: lang?.code === "fr"
			? "Titre d'Exemple"
			: lang?.code === "de"
			? "Beispieltitel"
			: `Title (${lang?.native})`,
		description: lang?.code === "es"
			? "Descripción del contenido aquí"
			: lang?.code === "fr"
			? "Description du contenu ici"
			: lang?.code === "de"
			? "Beschreibung des Inhalts hier"
			: `Description (${lang?.native})`,
		cta: lang?.code === "es"
			? "Más Información"
			: lang?.code === "fr"
			? "En Savoir Plus"
			: lang?.code === "de"
			? "Mehr Erfahren"
			: "Learn More",
		footer: lang?.code === "es"
			? "Contáctanos"
			: lang?.code === "fr"
			? "Contactez-nous"
			: lang?.code === "de"
			? "Kontaktieren Sie uns"
			: "Contact Us",
	};

	isTranslating.value = false;
	showPreview.value = true;
};

const applyTranslation = () => {
	emit("translate", targetLanguage.value, translations.value);
};

const getTextDirection = (code: string) => {
	return ["ar", "he", "ur"].includes(code) ? "rtl" : "ltr";
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-translate text-blue-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Template Localization
							</h2>
							<p class="text-sm text-gray-500">
								Translate your template for global audiences
							</p>
						</div>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- Main Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: Language Selection -->
					<div class="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
							Select Target Language
						</h3>
						<div class="space-y-2">
							<button
								v-for="lang in languages"
								:key="lang.code"
								class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left"
								:class="targetLanguage === lang.code
								? 'bg-blue-600 text-white'
								: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'"
								@click="targetLanguage = lang.code"
							>
								<span class="text-2xl">{{ lang.flag }}</span>
								<div class="flex-1">
									<div class="font-medium">{{ lang.name }}</div>
									<div class="text-sm opacity-80">{{ lang.native }}</div>
								</div>
								<i
									v-if="targetLanguage === lang.code"
									class="i-mdi-check-circle"
								/>
							</button>
						</div>

						<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
							<h4 class="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
								<i class="i-mdi-information mr-1" />
								RTL Support
							</h4>
							<p class="text-xs text-blue-700 dark:text-blue-400">
								Arabic, Hebrew, and Urdu templates will automatically adjust
								layout for right-to-left text direction.
							</p>
						</div>
					</div>

					<!-- Center: Fields & Translation -->
					<div class="flex-1 p-6 overflow-y-auto">
						<div class="max-w-2xl mx-auto">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
								Fields to Translate
							</h3>

							<div class="space-y-4 mb-6">
								<label
									v-for='field in ["title", "description", "cta", "footer"]'
									:key="field"
									class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
								>
									<input
										v-model="selectedFields"
										type="checkbox"
										:value="field"
										class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<div class="flex-1">
										<div class="font-medium text-gray-900 dark:text-white capitalize">
											{{ field === "cta" ? "Call-to-Action" : field }}
										</div>
										<div class="text-sm text-gray-500">
											{{
												field === "title"
												? "Main headline text"
												: field === "description"
												? "Body text content"
												: field === "cta"
												? "Button or link text"
												: "Footer information"
											}}
										</div>
									</div>
								</label>
							</div>

							<!-- Translation Progress -->
							<div v-if="isTranslating" class="mb-6">
								<div class="flex items-center justify-between mb-2">
									<span
										class="text-sm font-medium text-gray-700 dark:text-gray-300"
									>Translating...</span>
									<span class="text-sm text-gray-500">{{ progress }}%</span>
								</div>
								<div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div
										class="h-full bg-blue-600 transition-all duration-300"
										:style="`width: ${progress}%`"
									/>
								</div>
							</div>

							<!-- Translation Preview -->
							<div v-if="showPreview && !isTranslating" class="space-y-4">
								<h3 class="text-lg font-medium text-gray-900 dark:text-white">
									Translation Preview
								</h3>
								<div
									class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
									:dir="getTextDirection(targetLanguage)"
								>
									<div
										v-for="(value, key) in translations"
										:key="key"
										class="mb-4 last:mb-0"
									>
										<label
											class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
										>
											{{ key === "cta" ? "CTA" : key }}
										</label>
										<input
											v-model="translations[key]"
											type="text"
											class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
											:dir="getTextDirection(targetLanguage)"
										/>
									</div>
								</div>
							</div>

							<!-- Action Button -->
							<button
								v-if="!showPreview"
								class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
								:disabled="isTranslating || selectedFields.length === 0"
								@click="startTranslation"
							>
								<i class="i-mdi-auto-fix mr-2" />
								{{ isTranslating ? "Translating..." : "Auto-Translate" }}
							</button>

							<div v-else class="flex gap-3">
								<button
									class="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
									@click="showPreview = false"
								>
									Edit Fields
								</button>
								<button
									class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
									@click="applyTranslation"
								>
									<i class="i-mdi-check mr-2" />
									Apply Translation
								</button>
							</div>
						</div>
					</div>

					<!-- Right: Preview -->
					<div class="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
							Live Preview
						</h3>
						<div
							class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
							:dir="getTextDirection(targetLanguage)"
						>
							<img
								:src="template?.thumbnail || ''"
								class="w-full aspect-video object-cover"
							/>
							<div class="p-4">
								<div v-if="showPreview && !isTranslating" class="space-y-2">
									<h4 class="font-semibold text-gray-900 dark:text-white">
										{{ translations.title || "Title" }}
									</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">
										{{ translations.description || "Description" }}
									</p>
									<button class="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">
										{{ translations.cta || "CTA" }}
									</button>
									<p class="text-xs text-gray-500 mt-2">
										{{ translations.footer || "Footer" }}
									</p>
								</div>
								<div v-else class="text-center text-gray-400 py-4">
									<i class="i-mdi-eye-off text-2xl mb-2" />
									<p class="text-sm">Preview will appear here</p>
								</div>
							</div>
						</div>

						<div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
							<div class="flex items-start gap-2">
								<i class="i-mdi-alert text-yellow-600 mt-0.5" />
								<p class="text-xs text-yellow-700 dark:text-yellow-400">
									Always review translations for accuracy, especially for
									marketing and legal content.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
