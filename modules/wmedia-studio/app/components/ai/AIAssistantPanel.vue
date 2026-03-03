<script setup lang="ts">
import { useAI } from "~/composables/useAI";
import { useAISmartSuggestions } from "~/composables/useAISmartSuggestions";
import { useProjectStore } from "~/stores/project";

const showAIPanel = ref(false);
const activeTab = ref<"layout" | "copy" | "style">("layout");

const ai = useAI();
const smartSuggestions = useAISmartSuggestions();
const projectStore = useProjectStore();

// Layout Suggestions
const layoutPrompt = ref("");
const layoutSuggestions = ref<string[]>([]);

// Copywriting
const copyContext = ref({
	purpose: "headline",
	tone: "professional",
	industry: "",
	keywords: "",
});
const generatedCopies = ref<string[]>([]);

// Style Transfer
const stylePrompt = ref("");
const brandColors = ref(["#3b82f6", "#8b5cf6", "#ec4899"]);

const generateLayoutSuggestions = async () => {
	if (!layoutPrompt.value.trim()) return;

	try {
		const result = await ai.suggestLayout({
			elements: projectStore.currentProject?.timelineItems?.map(i => i.name)
				|| [],
			width: projectStore.currentProject?.width || 1200,
			height: projectStore.currentProject?.height || 800,
			style: layoutPrompt.value,
		});

		layoutSuggestions.value = result.elements || [];
	} catch (err) {
		console.error("Failed to generate layout suggestions:", err);
	}
};

const generateCopy = async () => {
	try {
		const result = await ai.generateContent({
			type: "text",
			prompt:
				`${copyContext.value.purpose} for ${copyContext.value.industry} industry. Tone: ${copyContext.value.tone}. Keywords: ${copyContext.value.keywords}`,
			style: copyContext.value.tone,
		});

		generatedCopies.value = result.content ? [result.content] : [];
	} catch (err) {
		console.error("Failed to generate copy:", err);
	}
};

const applyStyleTransfer = async () => {
	if (!stylePrompt.value.trim()) return;

	try {
		// TODO: Implement style transfer API call
		console.log(
			"Applying style:",
			stylePrompt.value,
			"with colors:",
			brandColors.value,
		);
	} catch (err) {
		console.error("Failed to apply style:", err);
	}
};

const applySuggestion = (suggestion: any) => {
	// TODO: Apply the layout suggestion to the canvas
	console.log("Applying suggestion:", suggestion);
};

const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
};

const getTabIcon = (tab: string) => {
	switch (tab) {
		case "layout":
			return "Layout";
		case "copy":
			return "Type";
		case "style":
			return "Palette";
		default:
			return "Sparkles";
	}
};
</script>

<template>
	<div>
		<!-- AI Toggle Button -->
		<button
			class="fixed right-4 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-purple-400 ring-offset-2': showAIPanel }"
			@click="showAIPanel = !showAIPanel"
			title="AI Assistant"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
			</svg>
		</button>

		<!-- AI Panel -->
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div
				v-if="showAIPanel"
				class="fixed right-0 top-0 z-40 h-screen w-96 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<!-- Header -->
				<div class="border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="text-white"
							>
								<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
							</svg>
							<h2 class="font-bold text-white">AI Assistant</h2>
						</div>
						<button
							class="text-white/80 hover:text-white"
							@click="showAIPanel = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<!-- Tabs -->
				<div class="flex border-b border-gray-200 dark:border-gray-700">
					<button
						v-for='tab in ["layout", "copy", "style"] as const'
						:key="tab"
						class="flex-1 py-3 text-sm font-medium capitalize transition-colors"
						:class="activeTab === tab
						? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
						@click="activeTab = tab"
					>
						{{ tab }}
					</button>
				</div>

				<!-- Content -->
				<div class="h-[calc(100vh-140px)] overflow-y-auto p-4">
					<!-- Layout Tab -->
					<div v-if="activeTab === 'layout'" class="space-y-4">
						<div>
							<label
								class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Describe your layout needs
							</label>
							<textarea
								v-model="layoutPrompt"
								placeholder="e.g., Create a modern hero section with headline, subtitle, and CTA button centered..."
								class="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
								rows="3"
							/>
						</div>

						<button
							class="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
							:disabled="!layoutPrompt.trim() || ai.loading.value"
							@click="generateLayoutSuggestions"
						>
							<span
								v-if="ai.loading"
								class="flex items-center justify-center gap-2"
							>
								<svg
									class="h-4 w-4 animate-spin"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									/>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Generating...
							</span>
							<span v-else>Generate Layout Ideas</span>
						</button>

						<!-- Layout Suggestions -->
						<div v-if="layoutSuggestions.length > 0" class="space-y-3 pt-4">
							<h3 class="text-sm font-medium text-gray-900 dark:text-white">
								Suggestions
							</h3>
							<div
								v-for="(suggestion, index) in layoutSuggestions"
								:key="index"
								class="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-purple-300 hover:shadow-md dark:border-gray-700 dark:hover:border-purple-500"
								@click="applySuggestion(suggestion)"
							>
								<p class="text-sm text-gray-700 dark:text-gray-300">
									{{ suggestion }}
								</p>
								<div class="mt-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
									<span>Click to apply</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M5 12h14" />
										<path d="m12 5 7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>
					</div>

					<!-- Copy Tab -->
					<div v-if="activeTab === 'copy'" class="space-y-4">
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label
									class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
								>Purpose</label>
								<select
									v-model="copyContext.purpose"
									class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
								>
									<option value="headline">Headline</option>
									<option value="cta">CTA Button</option>
									<option value="description">Description</option>
									<option value="seo">SEO Meta</option>
								</select>
							</div>
							<div>
								<label
									class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
								>Tone</label>
								<select
									v-model="copyContext.tone"
									class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
								>
									<option value="professional">Professional</option>
									<option value="casual">Casual</option>
									<option value="playful">Playful</option>
									<option value="urgent">Urgent</option>
								</select>
							</div>
						</div>

						<div>
							<label
								class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
							>Industry</label>
							<input
								v-model="copyContext.industry"
								type="text"
								placeholder="e.g., Technology, Fashion, Healthcare"
								class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							/>
						</div>

						<div>
							<label
								class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
							>Keywords (comma separated)</label>
							<input
								v-model="copyContext.keywords"
								type="text"
								placeholder="e.g., innovative, solution, grow"
								class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							/>
						</div>

						<button
							class="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
							:disabled="ai.loading.value"
							@click="generateCopy"
						>
							<span v-if="ai.loading">Generating...</span>
							<span v-else>Generate Copy</span>
						</button>

						<!-- Generated Copies -->
						<div v-if="generatedCopies.length > 0" class="space-y-2 pt-4">
							<h3 class="text-sm font-medium text-gray-900 dark:text-white">
								Generated Options
							</h3>
							<div
								v-for="(copy, index) in generatedCopies"
								:key="index"
								class="group relative rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
							>
								<p class="text-sm text-gray-700 dark:text-gray-300">
									{{ copy }}
								</p>
								<button
									class="absolute right-2 top-2 rounded p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-purple-600"
									@click="copyToClipboard(copy)"
									title="Copy to clipboard"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
										<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
									</svg>
								</button>
							</div>
						</div>
					</div>

					<!-- Style Tab -->
					<div v-if="activeTab === 'style'" class="space-y-4">
						<div>
							<label
								class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Describe your brand style
							</label>
							<textarea
								v-model="stylePrompt"
								placeholder="e.g., Modern minimalist with bold typography and vibrant gradients..."
								class="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
								rows="3"
							/>
						</div>

						<div>
							<label
								class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Brand Colors</label>
							<div class="flex flex-wrap gap-2">
								<div
									v-for="(color, index) in brandColors"
									:key="index"
									class="group relative"
								>
									<input
										v-model="brandColors[index]"
										type="color"
										class="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
									/>
									<button
										v-if="brandColors.length > 1"
										class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
										@click="brandColors.splice(index, 1)"
									>
										×
									</button>
								</div>
								<button
									class="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-purple-500 hover:text-purple-500 dark:border-gray-600"
									@click="brandColors.push(
										'#'
											+ Math.floor(Math.random() * 16777215).toString(16)
												.padStart(6, '0'),
									)"
								>
									+
								</button>
							</div>
						</div>

						<button
							class="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
							:disabled="!stylePrompt.trim() || ai.loading.value"
							@click="applyStyleTransfer"
						>
							<span v-if="ai.loading">Applying...</span>
							<span v-else>Apply Brand Style</span>
						</button>

						<!-- Quick Actions -->
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
							<h4 class="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
								Quick Actions
							</h4>
							<div class="flex flex-wrap gap-2">
								<button
									v-for='preset in ["Modern", "Vintage", "Playful", "Elegant", "Bold"]'
									:key="preset"
									class="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-purple-50 hover:text-purple-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-purple-900/30"
									@click="stylePrompt = preset + ' style with clean lines and '
									+ (preset === 'Vintage' ? 'muted' : 'vibrant') + ' colors'"
								>
									{{ preset }}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
