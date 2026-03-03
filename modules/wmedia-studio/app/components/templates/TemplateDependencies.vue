<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

interface Dependency {
	id: string;
	type: "font" | "image" | "icon" | "plugin" | "library";
	name: string;
	status: "available" | "missing" | "optional" | "premium";
	source?: string;
	size?: string;
	license?: string;
}

const dependencies = ref<Dependency[]>([
	{
		id: "1",
		type: "font",
		name: "Inter",
		status: "available",
		source: "Google Fonts",
		size: "2.4 MB",
		license: "OFL",
	},
	{
		id: "2",
		type: "font",
		name: "Roboto",
		status: "available",
		source: "Google Fonts",
		size: "1.8 MB",
		license: "Apache 2.0",
	},
	{
		id: "3",
		type: "image",
		name: "hero-background.jpg",
		status: "available",
		source: "Template Asset",
		size: "245 KB",
		license: "CC0",
	},
	{
		id: "4",
		type: "image",
		name: "logo-placeholder.png",
		status: "missing",
		source: "User Upload",
		size: "-",
		license: "-",
	},
	{
		id: "5",
		type: "icon",
		name: "mdi-icons",
		status: "available",
		source: "Material Design",
		size: "500 KB",
		license: "Apache 2.0",
	},
	{
		id: "6",
		type: "plugin",
		name: "Smart Crop Tool",
		status: "premium",
		source: "Media Studio Pro",
		size: "-",
		license: "Pro License",
	},
	{
		id: "7",
		type: "library",
		name: "gsap-animation",
		status: "available",
		source: "CDN",
		size: "45 KB",
		license: "GreenSock",
	},
]);

const getTypeIcon = (type: string) => {
	switch (type) {
		case "font":
			return "i-mdi-format-font";
		case "image":
			return "i-mdi-image";
		case "icon":
			return "i-mdi-shape";
		case "plugin":
			return "i-mdi-puzzle";
		case "library":
			return "i-mdi-code-braces";
		default:
			return "i-mdi-help-circle";
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "available":
			return "text-green-600 bg-green-100 dark:bg-green-900/30";
		case "missing":
			return "text-red-600 bg-red-100 dark:bg-red-900/30";
		case "optional":
			return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
		case "premium":
			return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
		default:
			return "text-gray-600 bg-gray-100";
	}
};

const getStatusIcon = (status: string) => {
	switch (status) {
		case "available":
			return "i-mdi-check-circle";
		case "missing":
			return "i-mdi-alert-circle";
		case "optional":
			return "i-mdi-information";
		case "premium":
			return "i-mdi-crown";
		default:
			return "i-mdi-help-circle";
	}
};

const missingCount = computed(() =>
	dependencies.value.filter(d => d.status === "missing").length
);
const availableCount = computed(() =>
	dependencies.value.filter(d => d.status === "available").length
);

const downloadMissing = () => {
	// Simulate downloading
	dependencies.value.forEach(dep => {
		if (dep.status === "missing") {
			dep.status = "available";
		}
	});
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
						<div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-package-variant text-amber-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Template Dependencies
							</h2>
							<p class="text-sm text-gray-500">
								Required resources for this template
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<div
							v-if="missingCount > 0"
							class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm"
						>
							{{ missingCount }} missing
						</div>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-6">
					<div class="max-w-4xl mx-auto">
						<!-- Summary Cards -->
						<div class="grid grid-cols-4 gap-4 mb-6">
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
								<div class="text-2xl font-bold text-gray-900 dark:text-white">
									{{ dependencies.length }}
								</div>
								<div class="text-sm text-gray-500">Total</div>
							</div>
							<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
								<div class="text-2xl font-bold text-green-600">
									{{ availableCount }}
								</div>
								<div class="text-sm text-gray-500">Available</div>
							</div>
							<div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
								<div class="text-2xl font-bold text-red-600">
									{{ missingCount }}
								</div>
								<div class="text-sm text-gray-500">Missing</div>
							</div>
							<div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
								<div class="text-2xl font-bold text-yellow-600">
									{{ dependencies.filter(d => d.status === "premium").length }}
								</div>
								<div class="text-sm text-gray-500">Premium</div>
							</div>
						</div>

						<!-- Dependencies List -->
						<div class="space-y-3">
							<div
								v-for="dep in dependencies"
								:key="dep.id"
								class="p-4 border rounded-xl flex items-center gap-4"
								:class="dep.status === 'missing'
								? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
								: 'border-gray-200 dark:border-gray-700'"
							>
								<div
									class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
									:class="getStatusColor(dep.status)"
								>
									<i :class="getTypeIcon(dep.type)" />
								</div>

								<div class="flex-1">
									<div class="flex items-center gap-2">
										<h4 class="font-medium text-gray-900 dark:text-white">
											{{ dep.name }}
										</h4>
										<span
											class="px-2 py-0.5 text-xs rounded-full font-medium"
											:class="getStatusColor(dep.status)"
										>
											{{ dep.status }}
										</span>
									</div>
									<div class="text-sm text-gray-500 mt-1">
										<span class="capitalize">{{ dep.type }}</span>
										<span v-if="dep.source"> • {{ dep.source }}</span>
										<span v-if="dep.size"> • {{ dep.size }}</span>
										<span v-if="dep.license"> • {{ dep.license }}</span>
									</div>
								</div>

								<button
									v-if="dep.status === 'missing'"
									class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
								>
									Install
								</button>
								<button
									v-else-if="dep.status === 'premium'"
									class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
								>
									<i class="i-mdi-crown mr-1" />
									Upgrade
								</button>
								<i
									v-else
									class="i-mdi-check-circle text-green-500 text-xl"
								/>
							</div>
						</div>

						<!-- Actions -->
						<div
							v-if="missingCount > 0"
							class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
						>
							<div class="flex items-center justify-between">
								<div>
									<h4 class="font-medium text-blue-900 dark:text-blue-300">
										Missing Dependencies
									</h4>
									<p class="text-sm text-blue-700 dark:text-blue-400">
										Install all missing resources to use this template
									</p>
								</div>
								<button
									class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
									@click="downloadMissing"
								>
									<i class="i-mdi-download mr-1" />
									Install All
								</button>
							</div>
						</div>

						<!-- License Info -->
						<div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
							<h4 class="font-medium text-gray-900 dark:text-white mb-3">
								<i class="i-mdi-license mr-1" />
								License Information
							</h4>
							<p class="text-sm text-gray-600 dark:text-gray-400">
								All dependencies in this template are either open-source (OFL,
								Apache 2.0) or included with your Media Studio subscription.
								Please review individual licenses for commercial use
								requirements.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
