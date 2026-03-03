<script setup lang="ts">
import type { Template } from "#shared/types";
import { computed, ref } from "vue";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "submit", rating: number, review: string): void;
	(e: "close"): void;
}>();

const userRating = ref(0);
const hoverRating = ref(0);
const review = ref("");
const sortBy = ref<"newest" | "highest" | "lowest">("newest");

const mockReviews = [
	{
		id: "r1",
		user: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=1" },
		rating: 5,
		review: "Absolutely love this template! Saved me hours of work.",
		date: new Date("2024-01-20T10:00:00Z"),
		helpful: 24,
	},
	{
		id: "r2",
		user: { name: "Mike Chen", avatar: "https://i.pravatar.cc/150?u=2" },
		rating: 4,
		review: "Great template, just wish it had more color options.",
		date: new Date("2024-01-18T15:30:00Z"),
		helpful: 12,
	},
	{
		id: "r3",
		user: { name: "Emily Davis", avatar: "https://i.pravatar.cc/150?u=3" },
		rating: 5,
		review: "Perfect for my social media campaign. Highly recommend!",
		date: new Date("2024-01-15T09:00:00Z"),
		helpful: 8,
	},
];

const sortedReviews = computed(() => {
	const sorted = [...mockReviews];
	switch (sortBy.value) {
		case "newest":
			return sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
		case "highest":
			return sorted.sort((a, b) => b.rating - a.rating);
		case "lowest":
			return sorted.sort((a, b) => a.rating - b.rating);
		default:
			return sorted;
	}
});

const ratingCounts = { 5: 45, 4: 23, 3: 8, 2: 3, 1: 1 };
const totalReviews = Object.values(ratingCounts).reduce((a, b) => a + b, 0);

const handleSubmit = () => {
	emit("submit", userRating.value, review.value);
	userRating.value = 0;
	review.value = "";
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Ratings & Reviews
					</h2>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400 text-xl" />
					</button>
				</div>

				<div class="flex-1 overflow-y-auto p-6">
					<!-- Rating Summary -->
					<div class="flex items-center gap-8 mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<div class="text-center">
							<div class="text-5xl font-bold text-gray-900 dark:text-white">
								{{ template!.rating }}
							</div>
							<div class="flex text-yellow-400 text-lg my-2">
								<i
									v-for="i in 5"
									:key="i"
									:class="i <= Math.round(template!.rating)
									? 'i-mdi-star'
									: 'i-mdi-star-outline'"
								/>
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-400">
								{{ totalReviews }} reviews
							</div>
						</div>
						<div class="flex-1 space-y-1">
							<div
								v-for="stars in [5, 4, 3, 2, 1]"
								:key="stars"
								class="flex items-center gap-2"
							>
								<span class="text-sm text-gray-600 dark:text-gray-400 w-3">{{
									stars
								}}</span>
								<i class="i-mdi-star text-yellow-400 text-sm" />
								<div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
									<div
										class="h-full bg-yellow-400 rounded-full"
										:style="{
											width: `${
												(ratingCounts[stars as keyof typeof ratingCounts]
													/ totalReviews) * 100
											}%`,
										}"
									/>
								</div>
								<span
									class="text-xs text-gray-500 dark:text-gray-400 w-8 text-right"
								>
									{{ ratingCounts[stars as keyof typeof ratingCounts] }}
								</span>
							</div>
						</div>
					</div>

					<!-- Write Review -->
					<div class="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
						<h3 class="font-medium text-gray-900 dark:text-white mb-4">
							Write a Review
						</h3>
						<div class="flex items-center gap-1 mb-4">
							<button
								v-for="i in 5"
								:key="i"
								class="text-2xl transition-colors"
								@mouseenter="hoverRating = i"
								@mouseleave="hoverRating = 0"
								@click="userRating = i"
							>
								<i
									:class="(hoverRating || userRating) >= i
									? 'i-mdi-star text-yellow-400'
									: 'i-mdi-star-outline text-gray-300 dark:text-gray-600'"
								/>
							</button>
							<span
								v-if="userRating > 0"
								class="ml-2 text-sm text-gray-600 dark:text-gray-400"
							>
								{{
									[
										"",
										"Poor",
										"Fair",
										"Good",
										"Very Good",
										"Excellent",
									][userRating]
								}}
							</span>
						</div>
						<textarea
							v-model="review"
							rows="3"
							placeholder="Share your experience with this template..."
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
						/>
						<div class="flex justify-end mt-3">
							<button
								:disabled="userRating === 0"
								class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
								@click="handleSubmit"
							>
								Submit Review
							</button>
						</div>
					</div>

					<!-- Reviews List -->
					<div>
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-medium text-gray-900 dark:text-white">
								All Reviews
							</h3>
							<select
								v-model="sortBy"
								class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-2 py-1"
							>
								<option value="newest">Newest First</option>
								<option value="highest">Highest Rated</option>
								<option value="lowest">Lowest Rated</option>
							</select>
						</div>
						<div class="space-y-4">
							<div
								v-for="review in sortedReviews"
								:key="review.id"
								class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
							>
								<div class="flex items-start gap-3">
									<img
										:src="review.user.avatar"
										class="w-10 h-10 rounded-full"
									/>
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<span class="font-medium text-gray-900 dark:text-white">{{
												review.user.name
											}}</span>
											<div class="flex text-yellow-400 text-sm">
												<i
													v-for="i in 5"
													:key="i"
													:class="i <= review.rating
													? 'i-mdi-star'
													: 'i-mdi-star-outline'"
												/>
											</div>
										</div>
										<p class="text-gray-700 dark:text-gray-300 mt-1">
											{{ review.review }}
										</p>
										<div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
											<span>{{ review.date.toLocaleDateString() }}</span>
											<button class="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
												<i class="i-mdi-thumb-up-outline" />
												Helpful ({{ review.helpful }})
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
