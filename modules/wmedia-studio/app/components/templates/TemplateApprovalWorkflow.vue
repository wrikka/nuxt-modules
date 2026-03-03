<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "submit", review: Review): void;
}>();

interface Review {
	id: string;
	reviewer: string;
	avatar: string;
	status: "pending" | "approved" | "rejected" | "changes_requested";
	comment: string;
	date: Date;
}

const workflowSteps = [
	{ id: "draft", name: "Draft", icon: "i-mdi-file-document" },
	{ id: "review", name: "In Review", icon: "i-mdi-eye" },
	{ id: "approved", name: "Approved", icon: "i-mdi-check-circle" },
	{ id: "published", name: "Published", icon: "i-mdi-publish" },
];

const currentStep = ref(1);
const reviews = ref<Review[]>([
	{
		id: "1",
		reviewer: "Sarah Chen",
		avatar: "https://i.pravatar.cc/150?u=1",
		status: "approved",
		comment: "Looks great! The color scheme works well with our brand.",
		date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
	},
	{
		id: "2",
		reviewer: "Mike Johnson",
		avatar: "https://i.pravatar.cc/150?u=2",
		status: "changes_requested",
		comment:
			"Please adjust the font size in the header. Should be larger for better readability.",
		date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
	},
]);

const newComment = ref("");
const selectedStatus = ref<Review["status"]>("pending");

const submitReview = () => {
	if (!newComment.value) return;

	const review: Review = {
		id: String(Date.now()),
		reviewer: "You",
		avatar: "https://i.pravatar.cc/150?u=me",
		status: selectedStatus.value,
		comment: newComment.value,
		date: new Date(),
	};

	reviews.value.unshift(review);
	newComment.value = "";

	if (selectedStatus.value === "approved") {
		currentStep.value = Math.min(
			currentStep.value + 1,
			workflowSteps.length - 1,
		);
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "approved":
			return "text-green-600 bg-green-100 dark:bg-green-900/30";
		case "rejected":
			return "text-red-600 bg-red-100 dark:bg-red-900/30";
		case "changes_requested":
			return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
		default:
			return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
	}
};

const getStatusIcon = (status: string) => {
	switch (status) {
		case "approved":
			return "i-mdi-check-circle";
		case "rejected":
			return "i-mdi-close-circle";
		case "changes_requested":
			return "i-mdi-refresh";
		default:
			return "i-mdi-clock";
	}
};

const formatDate = (date: Date) => {
	return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
		Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
		"day",
	);
};

const approvalProgress = computed(() => {
	const approved = reviews.value.filter(r => r.status === "approved").length;
	return Math.round((approved / Math.max(reviews.value.length, 1)) * 100);
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
						<div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-clipboard-check text-orange-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Approval Workflow
							</h2>
							<p class="text-sm text-gray-500">
								{{ props.template!.name }} - Review & Approval Process
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
							{{ approvalProgress }}% Approved
						</div>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Workflow Steps -->
				<div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center justify-center">
						<div
							v-for="(step, index) in workflowSteps"
							:key="step.id"
							class="flex items-center"
						>
							<div
								class="flex flex-col items-center"
								:class="index <= currentStep ? 'opacity-100' : 'opacity-50'"
							>
								<div
									class="w-12 h-12 rounded-full flex items-center justify-center text-xl"
									:class="index < currentStep
									? 'bg-green-500 text-white'
									: index === currentStep
									? 'bg-blue-600 text-white'
									: 'bg-gray-200 dark:bg-gray-700 text-gray-500'"
								>
									<i :class="index < currentStep ? 'i-mdi-check' : step.icon" />
								</div>
								<span
									class="text-xs font-medium mt-2 text-gray-700 dark:text-gray-300"
								>{{ step.name }}</span>
							</div>
							<div
								v-if="index < workflowSteps.length - 1"
								class="w-24 h-0.5 mx-2"
								:class="index < currentStep
								? 'bg-green-500'
								: 'bg-gray-200 dark:bg-gray-700'"
							/>
						</div>
					</div>
				</div>

				<!-- Main Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: Template Preview -->
					<div class="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
						<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
							Template Preview
						</h3>
						<div class="rounded-xl overflow-hidden shadow-lg mb-4">
							<img
								:src="props.template!.thumbnail"
								:alt="props.template!.name"
								class="w-full aspect-video object-cover"
							/>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-white">
							{{ props.template!.name }}
						</h4>
						<p class="text-sm text-gray-500 mt-1">
							{{ props.template!.category }}
						</p>

						<div class="mt-4 space-y-2">
							<div class="flex justify-between text-sm">
								<span class="text-gray-500">Created by</span>
								<span class="text-gray-700 dark:text-gray-300">{{
									props.template!.createdBy || "You"
								}}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500">Version</span>
								<span class="text-gray-700 dark:text-gray-300">1.0.0</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500">Reviewers</span>
								<span class="text-gray-700 dark:text-gray-300">{{
									reviews.length
								}}</span>
							</div>
						</div>
					</div>

					<!-- Right: Reviews -->
					<div class="flex-1 overflow-y-auto p-6">
						<!-- Submit Review -->
						<div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
							<h4 class="font-medium text-gray-900 dark:text-white mb-3">
								Submit Your Review
							</h4>
							<textarea
								v-model="newComment"
								rows="3"
								placeholder="Add your feedback..."
								class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none mb-3"
							/>
							<div class="flex items-center justify-between">
								<div class="flex gap-2">
									<button
										v-for='status in ["approved", "changes_requested", "rejected"] as const'
										:key="status"
										class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
										:class="selectedStatus === status
										? getStatusColor(status) + ' border-transparent'
										: 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100'"
										@click="selectedStatus = status"
									>
										<i :class="getStatusIcon(status)" class="mr-1" />
										{{ status.replace("_", " ") }}
									</button>
								</div>
								<button
									class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
									:disabled="!newComment"
									@click="submitReview"
								>
									Submit
								</button>
							</div>
						</div>

						<!-- Review History -->
						<h4 class="font-medium text-gray-900 dark:text-white mb-4">
							Review History
						</h4>
						<div class="space-y-4">
							<div
								v-for="review in reviews"
								:key="review.id"
								class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
							>
								<div class="flex items-start gap-3">
									<img
										:src="review.avatar"
										:alt="review.reviewer"
										class="w-10 h-10 rounded-full"
									/>
									<div class="flex-1">
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<span
													class="font-medium text-gray-900 dark:text-white"
												>{{ review.reviewer }}</span>
												<span
													class="px-2 py-0.5 text-xs rounded-full font-medium"
													:class="getStatusColor(review.status)"
												>
													{{ review.status.replace("_", " ") }}
												</span>
											</div>
											<span class="text-xs text-gray-500">{{
												formatDate(review.date)
											}}</span>
										</div>
										<p class="text-gray-600 dark:text-gray-400 mt-2">
											{{ review.comment }}
										</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Empty State -->
						<div
							v-if="reviews.length === 0"
							class="text-center py-8 text-gray-400"
						>
							<i class="i-mdi-clipboard-text-outline text-4xl mb-2" />
							<p>No reviews yet</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
