<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "save", seoData: SEOData): void;
}>();

interface SEOData {
	title: string;
	description: string;
	keywords: string[];
	ogImage: string;
	ogType: string;
	twitterCard: string;
	canonicalUrl: string;
	robots: string;
	structuredData: string;
}

const seo = reactive<SEOData>({
	title: props.template!.name,
	description: props.template!.description || "",
	keywords: props.template!.tags,
	ogImage: props.template!.thumbnail,
	ogType: "article",
	twitterCard: "summary_large_image",
	canonicalUrl: "",
	robots: "index, follow",
	structuredData: "",
});

const newKeyword = ref("");

const addKeyword = () => {
	if (newKeyword.value && !seo.keywords.includes(newKeyword.value)) {
		seo.keywords.push(newKeyword.value);
		newKeyword.value = "";
	}
};

const removeKeyword = (keyword: string) => {
	const index = seo.keywords.indexOf(keyword);
	if (index > -1) {
		seo.keywords.splice(index, 1);
	}
};

const titleLength = computed(() => seo.title.length);
const descriptionLength = computed(() => seo.description.length);

const getLengthClass = (current: number, min: number, max: number) => {
	if (current < min) return "text-yellow-600";
	if (current > max) return "text-red-600";
	return "text-green-600";
};

const generateStructuredData = () => {
	const data = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: seo.title,
		description: seo.description,
		image: seo.ogImage,
		keywords: seo.keywords.join(", "),
	};
	seo.structuredData = JSON.stringify(data, null, 2);
};

const saveSEO = () => {
	emit("save", { ...seo });
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-search-web text-teal-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								SEO Optimizer
							</h2>
							<p class="text-sm text-gray-500">
								Optimize template for search engines and social sharing
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

				<!-- Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: SEO Form -->
					<div class="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6">
						<div class="max-w-xl space-y-6">
							<!-- Meta Title -->
							<div>
								<label
									class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
								>
									Meta Title
									<span class="text-xs text-gray-500 ml-2">
										(<span :class="getLengthClass(titleLength, 30, 60)">{{
											titleLength
										}}</span>/60)
									</span>
								</label>
								<input
									v-model="seo.title"
									type="text"
									maxlength="70"
									class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
								/>
								<p class="text-xs text-gray-500 mt-1">
									Optimal length: 50-60 characters
								</p>
							</div>

							<!-- Meta Description -->
							<div>
								<label
									class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
								>
									Meta Description
									<span class="text-xs text-gray-500 ml-2">
										(<span
											:class="getLengthClass(descriptionLength, 120, 160)"
										>{{ descriptionLength }}</span>/160)
									</span>
								</label>
								<textarea
									v-model="seo.description"
									rows="3"
									maxlength="170"
									class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
								/>
								<p class="text-xs text-gray-500 mt-1">
									Optimal length: 150-160 characters
								</p>
							</div>

							<!-- Keywords -->
							<div>
								<label
									class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
								>
									Keywords
								</label>
								<div class="flex gap-2 mb-2">
									<input
										v-model="newKeyword"
										type="text"
										placeholder="Add keyword"
										class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
										@keyup.enter="addKeyword"
									/>
									<button
										class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
										@click="addKeyword"
									>
										<i class="i-mdi-plus" />
									</button>
								</div>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="keyword in seo.keywords"
										:key="keyword"
										class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
									>
										{{ keyword }}
										<button
											class="hover:text-blue-900"
											@click="removeKeyword(keyword)"
										>
											<i class="i-mdi-close" />
										</button>
									</span>
								</div>
							</div>

							<!-- Open Graph -->
							<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
								<h3 class="font-medium text-gray-900 dark:text-white mb-4">
									<i class="i-mdi-facebook mr-1" />
									Social Media (Open Graph)
								</h3>

								<div class="space-y-4">
									<div>
										<label
											class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
										>OG Image URL</label>
										<input
											v-model="seo.ogImage"
											type="text"
											class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
										/>
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label
												class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
											>OG Type</label>
											<select
												v-model="seo.ogType"
												class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
											>
												<option value="article">Article</option>
												<option value="website">Website</option>
												<option value="product">Product</option>
												<option value="image">Image</option>
											</select>
										</div>
										<div>
											<label
												class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
											>Twitter Card</label>
											<select
												v-model="seo.twitterCard"
												class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
											>
												<option value="summary">Summary</option>
												<option value="summary_large_image">Large Image</option>
												<option value="app">App</option>
											</select>
										</div>
									</div>
								</div>
							</div>

							<!-- Advanced -->
							<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
								<h3 class="font-medium text-gray-900 dark:text-white mb-4">
									<i class="i-mdi-cog mr-1" />
									Advanced
								</h3>

								<div class="space-y-4">
									<div>
										<label
											class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
										>Canonical URL</label>
										<input
											v-model="seo.canonicalUrl"
											type="text"
											placeholder="https://example.com/template"
											class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
										/>
									</div>
									<div>
										<label
											class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
										>Robots Meta</label>
										<select
											v-model="seo.robots"
											class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
										>
											<option value="index, follow">Index, Follow</option>
											<option value="noindex, follow">No Index, Follow</option>
											<option value="index, nofollow">Index, No Follow</option>
											<option value="noindex, nofollow">
												No Index, No Follow
											</option>
										</select>
									</div>
								</div>
							</div>

							<button
								class="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
								@click="saveSEO"
							>
								<i class="i-mdi-content-save mr-1" />
								Save SEO Settings
							</button>
						</div>
					</div>

					<!-- Right: Preview -->
					<div class="w-1/2 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
							Previews
						</h3>

						<!-- Google Preview -->
						<div class="mb-6">
							<h4 class="text-xs text-gray-500 uppercase tracking-wide mb-2">
								Google Search Result
							</h4>
							<div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
								<div class="text-sm text-gray-800 dark:text-gray-200 mb-1">
									example.com › templates › {{ props.template!.category }}
								</div>
								<div class="text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer mb-1">
									{{ seo.title || "Template Title" }}
								</div>
								<div class="text-sm text-gray-600 dark:text-gray-400">
									{{
										seo.description
										|| "Template description will appear here..."
									}}
								</div>
							</div>
						</div>

						<!-- Facebook Preview -->
						<div class="mb-6">
							<h4 class="text-xs text-gray-500 uppercase tracking-wide mb-2">
								Facebook Share
							</h4>
							<div class="max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
								<img
									:src="seo.ogImage || 'https://via.placeholder.com/1200x630'"
									class="w-full aspect-[1.91/1] object-cover"
								/>
								<div class="p-3 bg-gray-100 dark:bg-gray-700">
									<div class="text-xs text-gray-500 uppercase">
										{{ seo.ogType }}
									</div>
									<div class="text-sm font-medium text-gray-900 dark:text-white truncate">
										{{ seo.title }}
									</div>
									<div class="text-xs text-gray-500 truncate">
										{{ seo.description }}
									</div>
								</div>
							</div>
						</div>

						<!-- Twitter Preview -->
						<div class="mb-6">
							<h4 class="text-xs text-gray-500 uppercase tracking-wide mb-2">
								Twitter Card
							</h4>
							<div class="max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
								<img
									:src="seo.ogImage || 'https://via.placeholder.com/1200x600'"
									class="w-full aspect-[2/1] object-cover"
								/>
								<div class="p-3">
									<div class="text-sm font-medium text-gray-900 dark:text-white">
										{{ seo.title }}
									</div>
									<div class="text-xs text-gray-500 mt-1">
										{{ seo.description }}
									</div>
								</div>
							</div>
						</div>

						<!-- Structured Data -->
						<div>
							<div class="flex items-center justify-between mb-2">
								<h4 class="text-xs text-gray-500 uppercase tracking-wide">
									Structured Data (JSON-LD)
								</h4>
								<button
									class="text-xs text-blue-600 hover:text-blue-700"
									@click="generateStructuredData"
								>
									Generate
								</button>
							</div>
							<pre class="p-3 bg-gray-800 text-green-400 rounded-xl text-xs overflow-x-auto">{{ seo.structuredData || '// Click "Generate" to create structured data' }}</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
