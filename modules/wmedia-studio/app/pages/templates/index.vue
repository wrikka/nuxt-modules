<script setup lang="ts">
import type { Template } from "#shared/types";

const router = useRouter();

const searchQuery = ref("");
const selectedCategory = ref("");
const loading = ref(true);
const templates = ref<Template[]>([]);

const selectedTemplate = ref<Template | null>(null);

const filteredTemplates = computed(() => {
	return templates.value.filter((template) => {
		const matchesSearch =
			template.name.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| template.description?.toLowerCase().includes(
				searchQuery.value.toLowerCase(),
			)
			|| template.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.value.toLowerCase())
			);
		const matchesCategory = !selectedCategory.value
			|| template.category === selectedCategory.value;
		return matchesSearch && matchesCategory;
	});
});

const loadTemplates = async () => {
	loading.value = true;
	try {
		const { data } = await $fetch<{ data: Template[] }>("/api/templates");
		templates.value = data;
	} catch (error) {
		console.error("Failed to load templates:", error);
	} finally {
		loading.value = false;
	}
};

const openQuickPreview = (template: Template) => {
	selectedTemplate.value = template;
	showQuickPreview.value = true;
};

const handleSearch = (query: string, filters: any) => {
	searchQuery.value = query;
	showSmartSearch.value = false;
};

onMounted(() => {
	loadTemplates();
});

const useTemplate = async (templateId: string) => {
	const { data } = await $fetch<{ data: { projectId: string } }>(
		`/api/templates/${templateId}/use`,
	);
	router.push(`/editor/${data.projectId}`);
};

const showAIGenerator = ref(false);
const showImportExport = ref(false);
const showBatchApply = ref(false);
const showVersionHistory = ref(false);
const showRatings = ref(false);
const showRecommendations = ref(false);
const showCustomization = ref(false);
const showMyTemplates = ref(false);
const showFavorites = ref(false);
const showRecent = ref(false);
const showCollections = ref(false);
const showPreview = ref(false);
const showABTesting = ref(false);
const showWhiteLabel = ref(false);
const showAPI = ref(false);
const showMarketplace = ref(false);
const showQuickPreview = ref(false);
const showSmartSearch = ref(false);
const showSizePresets = ref(false);
const showBuilder = ref(false);
const showComparison = ref(false);
const showBrandAlignment = ref(false);
const showUseCases = ref(false);
const showLocalization = ref(false);
const showPerformance = ref(false);
const showAccessibilityBadge = ref(false);
const showVariables = ref(false);
const showDependencies = ref(false);
const showSEOOptimizer = ref(false);
const showBackupManager = ref(false);
const showMigration = ref(false);
const showApprovalWorkflow = ref(false);
const showCostEstimator = ref(false);
const showFeedback = ref(false);
const showUsageDashboard = ref(false);
const showContests = ref(false);
const showCertification = ref(false);
const showIntegrations = ref(false);
const showIndustry = ref(false);
const showAnalytics = ref(false);
const showShare = ref(false);
const showCollaboration = ref(false);
const showScheduling = ref(false);
const showAnimationLibrary = ref(false);
const showColorGenerator = ref(false);
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="container mx-auto px-4 py-8">
			<div class="flex items-center justify-between mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
					Templates
				</h1>
				<div class="flex gap-4">
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search templates..."
						class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
					<select
						v-model="selectedCategory"
						class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">All Categories</option>
						<option value="social-media">Social Media</option>
						<option value="presentation">Presentation</option>
						<option value="poster">Poster</option>
						<option value="flyer">Flyer</option>
						<option value="business-card">Business Card</option>
						<option value="resume">Resume</option>
						<option value="infographic">Infographic</option>
						<option value="menu">Menu</option>
						<option value="invitation">Invitation</option>
						<option value="banner">Banner</option>
						<option value="logo">Logo</option>
					</select>
				</div>
			</div>

			<div v-if="loading" class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500">
				</div>
				<p class="mt-4 text-gray-600 dark:text-gray-300">
					Loading templates...
				</p>
			</div>

			<div v-else class="space-y-6">
				<!-- Feature Buttons -->
				<div class="flex flex-wrap gap-2">
					<button
						class="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm"
						@click="showAIGenerator = true"
					>
						<i class="i-mdi-robot mr-1" />AI Generate
					</button>
					<button
						class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
						@click="showImportExport = true"
					>
						<i class="i-mdi-import mr-1" />Import/Export
					</button>
					<button
						class="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
						@click="showBatchApply = true"
					>
						<i class="i-mdi-layers mr-1" />Batch Apply
					</button>
					<button
						class="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm"
						@click="showIndustry = true"
					>
						<i class="i-mdi-domain mr-1" />Industries
					</button>
					<button
						class="px-3 py-2 bg-pink-600 text-white rounded-lg text-sm"
						@click="showRecommendations = true"
					>
						<i class="i-mdi-lightbulb mr-1" />Recommendations
					</button>
					<button
						class="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm"
						@click="showMarketplace = true"
					>
						<i class="i-mdi-store mr-1" />Marketplace
					</button>
				</div>

				<!-- Modal Components -->
				<TemplatesAITemplateGenerator
					v-if="showAIGenerator"
					@close="showAIGenerator = false"
				/>
				<TemplatesTemplateImportExport
					v-if="showImportExport"
					mode="import"
					@close="showImportExport = false"
				/>
				<TemplatesBatchTemplateApply
					v-if="showBatchApply"
					:templates="templates"
					@close="showBatchApply = false"
				/>
				<TemplatesIndustryTemplates
					v-if="showIndustry"
					:templates="templates"
					@close="showIndustry = false"
				/>
				<TemplatesSmartRecommendations
					v-if="showRecommendations"
					:templates="templates"
					@close="showRecommendations = false"
				/>
				<TemplatesTemplateAnalytics
					v-if="showAnalytics"
					@close="showAnalytics = false"
				/>
				<TemplatesTemplateShareLinks
					v-if="showShare"
					@close="showShare = false"
				/>
				<TemplatesTemplateCollaboration
					v-if="showCollaboration"
					@close="showCollaboration = false"
				/>
				<TemplatesTemplateScheduling
					v-if="showScheduling"
					@close="showScheduling = false"
				/>
				<TemplatesTemplateABTesting
					v-if="showABTesting"
					@close="showABTesting = false"
				/>
				<TemplatesWhiteLabelSettings
					v-if="showWhiteLabel"
					@close="showWhiteLabel = false"
				/>
				<TemplatesTemplateApiWebhooks v-if="showAPI" @close="showAPI = false" />
				<TemplatesTemplateMarketplace
					v-if="showMarketplace"
					:is-open="showMarketplace"
					@close="showMarketplace = false"
				/>

				<!-- New 24 Components -->
				<TemplatesTemplateQuickPreview
					v-if="showQuickPreview && selectedTemplate"
					:template="selectedTemplate"
					:is-open="showQuickPreview"
					@close="showQuickPreview = false"
					@use="useTemplate"
				/>
				<TemplatesTemplateBuilder
					v-if="showBuilder"
					@close="showBuilder = false"
				/>
				<TemplatesTemplateSizePresets
					v-if="showSizePresets"
					@close="showSizePresets = false"
				/>
				<TemplatesTemplateComparison
					v-if="showComparison"
					:templates="templates"
					@close="showComparison = false"
				/>
				<TemplatesTemplateBrandAlignment
					v-if="showBrandAlignment"
					@close="showBrandAlignment = false"
				/>
				<TemplatesTemplateUseCases
					v-if="showUseCases"
					@close="showUseCases = false"
				/>
				<TemplatesTemplateLocalization
					v-if="showLocalization"
					@close="showLocalization = false"
				/>
				<TemplatesTemplatePerformance
					v-if="showPerformance"
					@close="showPerformance = false"
				/>
				<TemplatesTemplateAccessibilityBadge
					v-if="showAccessibilityBadge"
					@close="showAccessibilityBadge = false"
				/>
				<TemplatesTemplateVariables
					v-if="showVariables"
					@close="showVariables = false"
				/>
				<TemplatesTemplateDependencies
					v-if="showDependencies"
					@close="showDependencies = false"
				/>
				<TemplatesTemplateSEOOptimizer
					v-if="showSEOOptimizer"
					@close="showSEOOptimizer = false"
				/>
				<TemplatesTemplateBackupManager
					v-if="showBackupManager"
					@close="showBackupManager = false"
				/>
				<TemplatesTemplateMigration
					v-if="showMigration"
					@close="showMigration = false"
				/>
				<TemplatesTemplateApprovalWorkflow
					v-if="showApprovalWorkflow"
					@close="showApprovalWorkflow = false"
				/>
				<TemplatesTemplateCostEstimator
					v-if="showCostEstimator"
					@close="showCostEstimator = false"
				/>
				<TemplatesTemplateFeedback
					v-if="showFeedback"
					@close="showFeedback = false"
				/>
				<TemplatesTemplateUsageDashboard
					v-if="showUsageDashboard"
					@close="showUsageDashboard = false"
				/>
				<TemplatesTemplateContests
					v-if="showContests"
					@close="showContests = false"
				/>
				<TemplatesTemplateCertification
					v-if="showCertification"
					@close="showCertification = false"
				/>
				<TemplatesTemplateIntegrations
					v-if="showIntegrations"
					@close="showIntegrations = false"
				/>
				<TemplatesTemplateAnimationLibrary
					v-if="showAnimationLibrary"
					@close="showAnimationLibrary = false"
				/>
				<TemplatesTemplateColorGenerator
					v-if="showColorGenerator"
					@close="showColorGenerator = false"
				/>

				<div v-if="filteredTemplates.length === 0" class="text-center py-12">
					<p class="text-gray-600 dark:text-gray-300">No templates found</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					<div
						v-for="template in filteredTemplates"
						:key="template.id"
						class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
						@click="useTemplate(template.id)"
					>
						<div class="aspect-video bg-gray-200 dark:bg-gray-600 relative">
							<img
								:src="template.thumbnail"
								:alt="template.name"
								class="w-full h-full object-cover"
							/>
							<div
								v-if="template.isPremium"
								class="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold"
							>
								Premium
							</div>
						</div>
						<div class="p-4">
							<h3 class="font-semibold text-gray-900 dark:text-white mb-2">
								{{ template.name }}
							</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
								{{ template.description }}
							</p>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-1">
									<span class="text-yellow-500">&#9733;</span>
									<span class="text-sm text-gray-600 dark:text-gray-300">
										{{ template.rating }}
									</span>
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">
									{{ template.usageCount }} uses
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>
