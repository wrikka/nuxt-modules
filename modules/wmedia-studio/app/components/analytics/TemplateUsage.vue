<script setup lang="ts">
interface TemplateUsage {
	templateId: string;
	name: string;
	category: string;
	uses: number;
	rating: number;
}

const props = defineProps<{
	templates: TemplateUsage[];
}>();

const sortedTemplates = computed(() =>
	[...props.templates].sort((a, b) => b.uses - a.uses).slice(0, 10)
);

const totalUses = computed(() =>
	props.templates.reduce((sum, t) => sum + t.uses, 0)
);
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
				<i class="i-mdi-view-grid text-teal-500" />
				Template Usage Analytics
			</h3>
			<span class="text-sm text-gray-500 dark:text-gray-400">{{ totalUses }}
				total uses</span>
		</div>

		<div class="space-y-3">
			<div
				v-for="(template, index) in sortedTemplates"
				:key="template.templateId"
				class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-medium text-sm">
					{{ index + 1 }}
				</div>
				<div class="flex-1 min-w-0">
					<div class="font-medium text-gray-900 dark:text-white truncate">
						{{ template.name }}
					</div>
					<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
						<span
							class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full"
						>{{ template.category }}</span>
						<span class="flex items-center gap-1">
							<i class="i-mdi-star text-yellow-500" />
							{{ template.rating }}
						</span>
					</div>
				</div>
				<div class="text-right">
					<div class="font-medium text-gray-900 dark:text-white">
						{{ template.uses }}
					</div>
					<div class="text-xs text-gray-500 dark:text-gray-400">uses</div>
				</div>
			</div>
		</div>

		<div
			v-if="templates.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-view-grid text-3xl mb-2" />
			<p>No template usage data</p>
		</div>
	</div>
</template>
