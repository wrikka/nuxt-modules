<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

const wcagLevels = ["A", "AA", "AAA"] as const;
const selectedLevel = ref<typeof wcagLevels[number]>("AA");

const accessibilityChecks = ref([
	{
		id: "contrast",
		name: "Color Contrast",
		status: "pass",
		score: 4.5,
		requirement: 4.5,
	},
	{
		id: "alt-text",
		name: "Alt Text Coverage",
		status: "pass",
		score: 100,
		requirement: 100,
	},
	{
		id: "font-size",
		name: "Minimum Font Size",
		status: "pass",
		score: 16,
		requirement: 14,
	},
	{
		id: "touch-target",
		name: "Touch Target Size",
		status: "warning",
		score: 42,
		requirement: 44,
	},
	{
		id: "color-dependency",
		name: "Not Color Dependent",
		status: "pass",
		score: 100,
		requirement: 100,
	},
	{
		id: "screen-reader",
		name: "Screen Reader Compatible",
		status: "pass",
		score: 100,
		requirement: 100,
	},
	{
		id: "animation",
		name: "Reduced Motion Support",
		status: "warning",
		score: 0,
		requirement: 100,
	},
	{
		id: "language",
		name: "Language Declared",
		status: "pass",
		score: 100,
		requirement: 100,
	},
]);

const isScanning = ref(false);
const scanProgress = ref(0);

const startScan = async () => {
	isScanning.value = true;
	scanProgress.value = 0;

	for (let i = 0; i <= 100; i += 10) {
		await new Promise(r => setTimeout(r, 150));
		scanProgress.value = i;
	}

	isScanning.value = false;
};

const complianceScore = computed(() => {
	const passed = accessibilityChecks.value.filter(c =>
		c.status === "pass"
	).length;
	return Math.round((passed / accessibilityChecks.value.length) * 100);
});

const getStatusColor = (status: string) => {
	switch (status) {
		case "pass":
			return "text-green-600 bg-green-100 dark:bg-green-900/30";
		case "warning":
			return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
		case "fail":
			return "text-red-600 bg-red-100 dark:bg-red-900/30";
		default:
			return "text-gray-600 bg-gray-100";
	}
};

const getStatusIcon = (status: string) => {
	switch (status) {
		case "pass":
			return "i-mdi-check-circle";
		case "warning":
			return "i-mdi-alert-circle";
		case "fail":
			return "i-mdi-close-circle";
		default:
			return "i-mdi-help-circle";
	}
};

onMounted(() => {
	startScan();
});
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
						<div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-accessibility text-purple-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Accessibility Check
							</h2>
							<p class="text-sm text-gray-500">
								WCAG 2.1 Compliance Verification
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<select
							v-model="selectedLevel"
							class="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm"
						>
							<option value="A">WCAG A (Minimum)</option>
							<option value="AA">WCAG AA (Standard)</option>
							<option value="AAA">WCAG AAA (Enhanced)</option>
						</select>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Scanning State -->
				<div
					v-if="isScanning"
					class="flex-1 flex flex-col items-center justify-center"
				>
					<div class="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4" />
					<p class="text-lg font-medium text-gray-900 dark:text-white">
						Scanning for accessibility issues...
					</p>
					<div class="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
						<div
							class="h-full bg-purple-600 transition-all duration-300"
							:style="`width: ${scanProgress}%`"
						/>
					</div>
				</div>

				<!-- Results -->
				<div v-else class="flex-1 flex overflow-hidden">
					<!-- Left: Summary -->
					<div class="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
						<!-- Compliance Badge -->
						<div class="text-center mb-6">
							<div
								class="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-2"
								:class="complianceScore >= 90
								? 'bg-green-100 dark:bg-green-900/30'
								: complianceScore >= 70
								? 'bg-yellow-100 dark:bg-yellow-900/30'
								: 'bg-red-100 dark:bg-red-900/30'"
							>
								<span
									class="text-3xl font-bold"
									:class="complianceScore >= 90
									? 'text-green-600'
									: complianceScore >= 70
									? 'text-yellow-600'
									: 'text-red-600'"
								>
									{{ complianceScore }}%
								</span>
							</div>
							<p class="font-medium text-gray-900 dark:text-white">
								Compliance Score
							</p>
							<p class="text-sm text-gray-500 mt-1">
								WCAG {{ selectedLevel }} Level
							</p>
						</div>

						<!-- Summary Stats -->
						<div class="grid grid-cols-3 gap-3 mb-6">
							<div class="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
								<div class="text-xl font-bold text-green-600">
									{{
										accessibilityChecks.filter(c => c.status === "pass")
										.length
									}}
								</div>
								<div class="text-xs text-gray-500">Pass</div>
							</div>
							<div class="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
								<div class="text-xl font-bold text-yellow-600">
									{{
										accessibilityChecks.filter(c => c.status === "warning")
										.length
									}}
								</div>
								<div class="text-xs text-gray-500">Warnings</div>
							</div>
							<div class="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
								<div class="text-xl font-bold text-red-600">
									{{
										accessibilityChecks.filter(c => c.status === "fail")
										.length
									}}
								</div>
								<div class="text-xs text-gray-500">Failed</div>
							</div>
						</div>

						<!-- Template Info -->
						<div class="p-4 bg-white dark:bg-gray-800 rounded-xl">
							<h4 class="font-medium text-gray-900 dark:text-white mb-2">
								Template Info
							</h4>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-500">Name</span>
									<span class="text-gray-700 dark:text-gray-300">{{
										template!.name
									}}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Category</span>
									<span class="text-gray-700 dark:text-gray-300">{{
										template!.category
									}}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Elements</span>
									<span class="text-gray-700 dark:text-gray-300">{{
										template!.elements.length
									}}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Check Results -->
					<div class="flex-1 overflow-y-auto p-6">
						<div class="space-y-3">
							<div
								v-for="check in accessibilityChecks"
								:key="check.id"
								class="p-4 border rounded-xl flex items-start gap-4"
								:class="check.status === 'pass'
								? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
								: check.status === 'warning'
								? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10'
								: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'"
							>
								<div
									class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
									:class="getStatusColor(check.status)"
								>
									<i :class="getStatusIcon(check.status)" />
								</div>
								<div class="flex-1">
									<div class="flex items-center justify-between">
										<h4 class="font-medium text-gray-900 dark:text-white">
											{{ check.name }}
										</h4>
										<span
											class="px-2 py-1 rounded-full text-xs font-medium"
											:class="getStatusColor(check.status)"
										>
											{{
												check.status === "pass"
												? "Passed"
												: check.status === "warning"
												? "Warning"
												: "Failed"
											}}
										</span>
									</div>
									<div class="mt-2 flex items-center gap-4 text-sm">
										<div class="text-gray-600 dark:text-gray-400">
											Current: <span class="font-medium">{{
												check.score
											}}</span>
										</div>
										<div class="text-gray-400">→</div>
										<div class="text-gray-600 dark:text-gray-400">
											Required: <span class="font-medium">{{
												check.requirement
											}}</span>
										</div>
									</div>

									<div v-if="check.status !== 'pass'" class="mt-3 flex gap-2">
										<button class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
											Auto-fix
										</button>
										<button class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
											Learn more
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Accessibility Tips -->
						<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
							<h4 class="font-medium text-blue-900 dark:text-blue-300 mb-3">
								<i class="i-mdi-lightbulb mr-1" />
								Accessibility Tips
							</h4>
							<ul class="space-y-2 text-sm text-blue-700 dark:text-blue-400">
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Ensure all images have descriptive alt text
								</li>
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Color contrast ratio should be at least 4.5:1 for text
								</li>
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Interactive elements need 44×44px minimum touch targets
								</li>
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Don't rely solely on color to convey information
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
