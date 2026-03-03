<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "submit", feedback: Feedback): void;
}>();

interface Feedback {
	id: string;
	type: "bug" | "feature" | "improvement" | "praise";
	message: string;
	rating: number;
	email?: string;
	allowContact: boolean;
}

const feedbackType = ref<Feedback["type"]>("improvement");
const message = ref("");
const rating = ref(0);
const email = ref("");
const allowContact = ref(false);
const isSubmitting = ref(false);
const showSuccess = ref(false);

const feedbackTypes = [
	{
		id: "bug",
		name: "Bug Report",
		icon: "i-mdi-bug",
		color: "text-red-600 bg-red-100",
	},
	{
		id: "feature",
		name: "Feature Request",
		icon: "i-mdi-lightbulb",
		color: "text-yellow-600 bg-yellow-100",
	},
	{
		id: "improvement",
		name: "Improvement",
		icon: "i-mdi-arrow-up",
		color: "text-blue-600 bg-blue-100",
	},
	{
		id: "praise",
		name: "Kudos",
		icon: "i-mdi-heart",
		color: "text-pink-600 bg-pink-100",
	},
];

const submitFeedback = async () => {
	if (!message.value || rating.value === 0) return;

	isSubmitting.value = true;
	await new Promise(r => setTimeout(r, 1000));

	const feedback: Feedback = {
		id: String(Date.now()),
		type: feedbackType.value,
		message: message.value,
		rating: rating.value,
		email: email.value,
		allowContact: allowContact.value,
	};

	emit("submit", feedback);
	isSubmitting.value = false;
	showSuccess.value = true;

	setTimeout(() => {
		showSuccess.value = false;
		emit("close");
	}, 2000);
};

const quickFeedback = [
	"Great template!",
	"Needs more color options",
	"Font is hard to read",
	"Love the layout",
	"Missing mobile version",
];
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
			@click.self="emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-message-text text-rose-600 text-xl" />
						</div>
						<div>
							<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
								Send Feedback
							</h2>
							<p class="text-xs text-gray-500">
								Help us improve this template
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
				<div class="p-6 overflow-y-auto">
					<!-- Template Info -->
					<div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-6">
						<img
							:src="props.template!.thumbnail"
							class="w-16 h-12 object-cover rounded-lg"
						/>
						<div>
							<p class="font-medium text-sm text-gray-900 dark:text-white">
								{{ props.template!.name }}
							</p>
							<p class="text-xs text-gray-500">
								{{ props.template!.category }}
							</p>
						</div>
					</div>

					<!-- Feedback Type -->
					<div class="mb-4">
						<label
							class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
						>
							What's this about?
						</label>
						<div class="grid grid-cols-2 gap-2">
							<button
								v-for="type in feedbackTypes"
								:key="type.id"
								class="flex items-center gap-2 p-3 rounded-xl border transition-colors text-left"
								:class="feedbackType === type.id
								? type.color + ' border-transparent'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
								@click="feedbackType = type.id as Feedback['type']"
							>
								<i :class="type.icon" />
								<span class="text-sm font-medium">{{ type.name }}</span>
							</button>
						</div>
					</div>

					<!-- Rating -->
					<div class="mb-4">
						<label
							class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
						>
							How would you rate this template?
						</label>
						<div class="flex gap-1">
							<button
								v-for="star in 5"
								:key="star"
								class="text-2xl transition-colors"
								:class="star <= rating
								? 'text-yellow-400'
								: 'text-gray-300 dark:text-gray-600'"
								@click="rating = star"
							>
								<i
									:class="star <= rating ? 'i-mdi-star' : 'i-mdi-star-outline'"
								/>
							</button>
						</div>
					</div>

					<!-- Quick Suggestions -->
					<div class="mb-4">
						<label
							class="text-xs text-gray-500 uppercase tracking-wide mb-2 block"
						>Quick suggestions</label>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="suggestion in quickFeedback"
								:key="suggestion"
								class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
								@click="message = suggestion"
							>
								{{ suggestion }}
							</button>
						</div>
					</div>

					<!-- Message -->
					<div class="mb-4">
						<label
							class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
						>
							Your feedback
						</label>
						<textarea
							v-model="message"
							rows="4"
							placeholder="Tell us more..."
							class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl resize-none"
						/>
					</div>

					<!-- Email (optional) -->
					<div class="mb-4">
						<label class="flex items-center gap-2 mb-2">
							<input
								v-model="allowContact"
								type="checkbox"
								class="rounded border-gray-300 text-blue-600"
							/>
							<span class="text-sm text-gray-700 dark:text-gray-300"
							>Allow us to contact you about this</span>
						</label>
						<input
							v-if="allowContact"
							v-model="email"
							type="email"
							placeholder="your@email.com"
							class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-2"
						/>
					</div>
				</div>

				<!-- Footer -->
				<div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<button
						class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
						:disabled="!message || rating === 0 || isSubmitting"
						@click="submitFeedback"
					>
						<span v-if="isSubmitting">Sending...</span>
						<span v-else><i class="i-mdi-send mr-1" /> Send Feedback</span>
					</button>
				</div>

				<!-- Success Toast -->
				<Transition name="fade">
					<div
						v-if="showSuccess"
						class="absolute inset-0 bg-white dark:bg-gray-800 flex flex-col items-center justify-center"
					>
						<i class="i-mdi-check-circle text-green-500 text-6xl mb-4" />
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
							Thank You!
						</h3>
						<p class="text-gray-500">Your feedback helps us improve.</p>
					</div>
				</Transition>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
