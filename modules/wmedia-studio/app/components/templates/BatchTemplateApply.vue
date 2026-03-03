<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed, ref } from "vue";

const props = defineProps<{
	templates: Template[];
}>();

const emit = defineEmits<{
	(e: "apply", templateIds: string[], sizes: string[]): void;
	(e: "close"): void;
}>();

const selectedTemplates = ref<string[]>([]);
const selectedSizes = ref<string[]>(["1080x1080"]);
const activeStep = ref<"select" | "configure" | "preview">("select");

const commonSizes = [
	{ value: "1080x1080", label: "Instagram Post (1:1)", platform: "instagram" },
	{
		value: "1080x1350",
		label: "Instagram Portrait (4:5)",
		platform: "instagram",
	},
	{
		value: "1080x1920",
		label: "Instagram Story (9:16)",
		platform: "instagram",
	},
	{ value: "1200x630", label: "Facebook Post", platform: "facebook" },
	{ value: "1500x500", label: "Twitter Header", platform: "twitter" },
	{ value: "1600x900", label: "LinkedIn Post", platform: "linkedin" },
	{ value: "1920x1080", label: "YouTube Thumbnail", platform: "youtube" },
	{ value: "1200x1200", label: "Pinterest Pin", platform: "pinterest" },
];

const mockTemplates: Template[] = [
	{
		id: "batch-1",
		name: "Promotional Banner Set",
		description: "Multi-platform promotional banners",
		thumbnail: "https://picsum.photos/400/300?random=40",
		category: "banner",
		tags: ["promo", "sale"],
		elements: [],
		width: 1200,
		height: 600,
		backgroundColor: "#ffffff",
		isPremium: false,
		rating: 4.7,
		usageCount: 150,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-20T00:00:00Z"),
	},
	{
		id: "batch-2",
		name: "Social Media Kit",
		description: "Complete social media template set",
		thumbnail: "https://picsum.photos/400/300?random=41",
		category: "social-media",
		tags: ["social", "kit"],
		elements: [],
		width: 1080,
		height: 1080,
		backgroundColor: "#f5f5f5",
		isPremium: true,
		rating: 4.9,
		usageCount: 300,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-20T00:00:00Z"),
	},
];

const displayTemplates = computed(() => {
	return props.templates.length > 0 ? props.templates : mockTemplates;
});

const isTemplateSelected = (id: string) => selectedTemplates.value.includes(id);

const toggleTemplate = (id: string) => {
	if (isTemplateSelected(id)) {
		selectedTemplates.value = selectedTemplates.value.filter(t => t !== id);
	} else {
		selectedTemplates.value.push(id);
	}
};

const canProceed = computed(() => {
	if (activeStep.value === "select") return selectedTemplates.value.length > 0;
	if (activeStep.value === "configure") return selectedSizes.value.length > 0;
	return true;
});

const handleNext = () => {
	if (activeStep.value === "select") activeStep.value = "configure";
	else if (activeStep.value === "configure") activeStep.value = "preview";
};

const handleBack = () => {
	if (activeStep.value === "configure") activeStep.value = "select";
	else if (activeStep.value === "preview") activeStep.value = "configure";
};

const handleApply = () => {
	emit("apply", selectedTemplates.value, selectedSizes.value);
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div>
						<h2 class="text-xl font-bold text-gray-900 dark:text-white">
							Batch Template Apply
						</h2>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Apply templates to multiple sizes at once
						</p>
					</div>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400 text-xl" />
					</button>
				</div>

				<!-- Steps -->
				<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-4">
						<div
							v-for='(step, index) in [{ id: "select", label: "Select Templates" }, {
								id: "configure",
								label: "Configure Sizes",
							}, { id: "preview", label: "Preview & Apply" }]'
							:key="step.id"
							class="flex items-center gap-2"
						>
							<div
								class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
								:class="[
									activeStep === step.id
										? 'bg-blue-600 text-white'
										: index
												< ['select', 'configure', 'preview'].indexOf(activeStep)
										? 'bg-green-500 text-white'
										: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
								]"
							>
								<i
									v-if="index
									< ['select', 'configure', 'preview'].indexOf(activeStep)"
									class="i-mdi-check"
								/>
								<span v-else>{{ index + 1 }}</span>
							</div>
							<span
								class="text-sm"
								:class="activeStep === step.id
								? 'text-gray-900 dark:text-white font-medium'
								: 'text-gray-500 dark:text-gray-400'"
							>
								{{ step.label }}
							</span>
							<div
								v-if="index < 2"
								class="w-8 h-px bg-gray-300 dark:bg-gray-600"
							/>
						</div>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-6">
					<!-- Step 1: Select Templates -->
					<div v-if="activeStep === 'select'" class="space-y-4">
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
							Select templates to apply in batch ({{ selectedTemplates.length }}
							selected)
						</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							<div
								v-for="template in displayTemplates"
								:key="template.id"
								class="relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all"
								:class="isTemplateSelected(template.id)
								? 'border-blue-500 shadow-md'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
								@click="toggleTemplate(template.id)"
							>
								<div class="aspect-video">
									<img
										:src="template.thumbnail"
										:alt="template.name"
										class="w-full h-full object-cover"
									/>
								</div>
								<div class="p-3 flex items-center justify-between">
									<span
										class="font-medium text-gray-900 dark:text-white text-sm"
									>{{ template.name }}</span>
									<i
										:class="isTemplateSelected(template.id)
										? 'i-mdi-check-circle text-blue-500'
										: 'i-mdi-circle-outline text-gray-400'"
									/>
								</div>
							</div>
						</div>
					</div>

					<!-- Step 2: Configure Sizes -->
					<div v-else-if="activeStep === 'configure'" class="space-y-4">
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
							Select sizes to generate ({{ selectedSizes.length }} selected)
						</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label
								v-for="size in commonSizes"
								:key="size.value"
								class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
								:class="selectedSizes.includes(size.value)
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
							>
								<input
									type="checkbox"
									:value="size.value"
									v-model="selectedSizes"
									class="w-4 h-4 text-blue-600 rounded"
								/>
								<div class="flex-1">
									<div class="font-medium text-gray-900 dark:text-white">
										{{ size.label }}
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">
										{{ size.value.replace("x", " × ") }} px
									</div>
								</div>
								<i :class="`i-mdi-${size.platform} text-gray-400`" />
							</label>
						</div>
					</div>

					<!-- Step 3: Preview -->
					<div v-else class="space-y-4">
						<div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
							<p class="text-sm text-blue-800 dark:text-blue-300">
								<i class="i-mdi-information-outline mr-1" />
								Ready to create {{ selectedTemplates.length }} templates × {{
									selectedSizes.length
								}} sizes = {{ selectedTemplates.length * selectedSizes.length }}
								total designs
							</p>
						</div>
						<div class="space-y-2">
							<div
								v-for="template in displayTemplates.filter(t => selectedTemplates.includes(t.id))"
								:key="template.id"
								class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
							>
								<img
									:src="template.thumbnail"
									class="w-16 h-12 object-cover rounded"
								/>
								<div class="flex-1">
									<div class="font-medium text-gray-900 dark:text-white">
										{{ template.name }}
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">
										{{ selectedSizes.length }} sizes will be generated
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<button
						v-if="activeStep !== 'select'"
						class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="handleBack"
					>
						<i class="i-mdi-arrow-left mr-1" />
						Back
					</button>
					<div v-else />
					<button
						v-if="activeStep !== 'preview'"
						:disabled="!canProceed"
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
						@click="handleNext"
					>
						Next
						<i class="i-mdi-arrow-right ml-1" />
					</button>
					<button
						v-else
						class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
						@click="handleApply"
					>
						<i class="i-mdi-check mr-1" />
						Apply All Templates
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
