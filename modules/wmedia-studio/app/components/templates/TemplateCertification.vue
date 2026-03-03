<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

interface Certification {
	id: string;
	name: string;
	description: string;
	icon: string;
	color: string;
	requirements: string[];
	earned: boolean;
	earnedDate?: Date;
	expiryDate?: Date;
}

const certifications = ref<Certification[]>([
	{
		id: "pro",
		name: "Pro Verified",
		description: "Template meets professional quality standards",
		icon: "i-mdi-check-decagram",
		color: "text-blue-600 bg-blue-100",
		requirements: [
			"High resolution assets",
			"Layer organization",
			"Color consistency",
		],
		earned: true,
		earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
	},
	{
		id: "trending",
		name: "Trending",
		description: "Template is currently popular among users",
		icon: "i-mdi-trending-up",
		color: "text-green-600 bg-green-100",
		requirements: ["1000+ uses in last 30 days", "4.5+ star rating"],
		earned: true,
		earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
	},
	{
		id: "accessibility",
		name: "Accessibility Champion",
		description: "Template is fully accessible for all users",
		icon: "i-mdi-accessibility",
		color: "text-purple-600 bg-purple-100",
		requirements: [
			"WCAG AA compliance",
			"Screen reader compatible",
			"High contrast",
		],
		earned: false,
	},
	{
		id: "mobile",
		name: "Mobile Optimized",
		description: "Template works perfectly on mobile devices",
		icon: "i-mdi-cellphone",
		color: "text-orange-600 bg-orange-100",
		requirements: ["Responsive design", "Touch-friendly", "Mobile preview"],
		earned: true,
		earnedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
	},
	{
		id: "multilingual",
		name: "Global Ready",
		description: "Template supports multiple languages",
		icon: "i-mdi-translate",
		color: "text-pink-600 bg-pink-100",
		requirements: ["UTF-8 support", "RTL compatible", "Variable text support"],
		earned: false,
	},
	{
		id: "performance",
		name: "Speed Optimized",
		description: "Template loads quickly with optimized assets",
		icon: "i-mdi-speedometer",
		color: "text-teal-600 bg-teal-100",
		requirements: ["Compressed images", "Web fonts", "Under 1MB"],
		earned: true,
		earnedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
	},
]);

const earnedCount = computed(() =>
	certifications.value.filter(c => c.earned).length
);
const progress = computed(() =>
	Math.round((earnedCount.value / certifications.value.length) * 100)
);

const applyForCertification = (certId: string) => {
	const cert = certifications.value.find(c => c.id === certId);
	if (cert) {
		cert.earned = true;
		cert.earnedDate = new Date();
	}
};

const formatDate = (date?: Date) => {
	if (!date) return "";
	return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
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
						<div class="w-10 h-10 bg-gold-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-medal text-yellow-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Template Certifications
							</h2>
							<p class="text-sm text-gray-500">
								Quality badges and achievements
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

				<!-- Progress Banner -->
				<div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
					<div class="flex items-center justify-center gap-8 text-white">
						<div class="text-center">
							<div class="text-3xl font-bold">
								{{ earnedCount }}/{{ certifications.length }}
							</div>
							<div class="text-sm opacity-80">Badges Earned</div>
						</div>
						<div class="w-px h-12 bg-white/30" />
						<div class="text-center">
							<div class="text-3xl font-bold">{{ progress }}%</div>
							<div class="text-sm opacity-80">Completion</div>
						</div>
						<div class="w-48">
							<div class="h-3 bg-white/30 rounded-full overflow-hidden">
								<div
									class="h-full bg-white rounded-full"
									:style="`width: ${progress}%`"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-6">
					<div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
						<div
							v-for="cert in certifications"
							:key="cert.id"
							class="p-4 border rounded-xl transition-all"
							:class="cert.earned
							? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10'
							: 'border-gray-200 dark:border-gray-700'"
						>
							<div class="flex items-start gap-4">
								<div
									class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
									:class="cert.color"
								>
									<i :class="cert.icon" />
								</div>
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<h3 class="font-semibold text-gray-900 dark:text-white">
											{{ cert.name }}
										</h3>
										<span
											v-if="cert.earned"
											class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full"
										>
											Earned
										</span>
									</div>
									<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
										{{ cert.description }}
									</p>

									<div class="mt-3">
										<p class="text-xs text-gray-500 mb-2">Requirements:</p>
										<ul class="space-y-1">
											<li
												v-for="req in cert.requirements"
												:key="req"
												class="flex items-center gap-2 text-sm"
												:class="cert.earned
												? 'text-green-700 dark:text-green-400'
												: 'text-gray-600 dark:text-gray-400'"
											>
												<i
													:class="cert.earned
													? 'i-mdi-check-circle text-green-500'
													: 'i-mdi-circle-outline text-gray-400'"
												/>
												{{ req }}
											</li>
										</ul>
									</div>

									<div class="mt-3 flex items-center justify-between">
										<span
											v-if="cert.earned && cert.earnedDate"
											class="text-xs text-gray-500"
										>
											Earned {{ formatDate(cert.earnedDate) }}
										</span>
										<button
											v-if="!cert.earned"
											class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
											@click="applyForCertification(cert.id)"
										>
											Apply Now
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Certification Benefits -->
					<div class="max-w-4xl mx-auto mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
						<h3 class="font-medium text-blue-900 dark:text-blue-300 mb-3">
							<i class="i-mdi-star mr-1" />
							Why Get Certified?
						</h3>
						<div class="grid grid-cols-3 gap-4 text-sm">
							<div class="flex items-start gap-2">
								<i class="i-mdi-trending-up text-blue-600 mt-0.5" />
								<span class="text-blue-700 dark:text-blue-400"
								>Higher visibility in search results</span>
							</div>
							<div class="flex items-start gap-2">
								<i class="i-mdi-account-plus text-blue-600 mt-0.5" />
								<span class="text-blue-700 dark:text-blue-400"
								>More users trust your templates</span>
							</div>
							<div class="flex items-start gap-2">
								<i class="i-mdi-currency-usd text-blue-600 mt-0.5" />
								<span class="text-blue-700 dark:text-blue-400"
								>Premium pricing opportunities</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
