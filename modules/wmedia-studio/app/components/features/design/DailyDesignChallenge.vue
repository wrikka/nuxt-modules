<script setup lang="ts">
const isOpen = ref(false);
const hasCompleted = ref(false);

const todayChallenge = ref({
	id: 1,
	title: "Design a Minimalist Logo",
	theme: "Simplicity & Elegance",
	colorPalette: ["#1a1a1a", "#ffffff", "#f5f5f5", "#333333"],
	description:
		"Create a minimalist logo using only geometric shapes and no more than 2 colors.",
	difficulty: "Medium",
	timeEstimate: "45 min",
	inspiration: ["Apple", "Nike", "Spotify"],
	completedBy: 1234,
});

const startChallenge = () => {
	alert("Starting challenge: " + todayChallenge.value.title);
	isOpen.value = false;
};

const submitDesign = () => {
	hasCompleted.value = true;
	alert("🎉 Challenge completed! Great job!");
};
</script>

<template>
	<div class="relative">
		<!-- Challenge Card -->
		<div
			class="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white cursor-pointer hover:shadow-lg transition-shadow"
			@click="isOpen = true"
		>
			<div class="flex items-start justify-between mb-2">
				<div>
					<p class="text-xs font-medium opacity-80">Daily Challenge</p>
					<h3 class="font-bold">{{ todayChallenge.title }}</h3>
				</div>
				<div class="text-2xl">🏆</div>
			</div>
			<p class="text-sm opacity-90 mb-3">{{ todayChallenge.theme }}</p>
			<div class="flex items-center gap-2 text-xs">
				<span class="px-2 py-1 bg-white/20 rounded-full">{{
					todayChallenge.difficulty
				}}</span>
				<span class="px-2 py-1 bg-white/20 rounded-full">{{
					todayChallenge.timeEstimate
				}}</span>
			</div>
		</div>

		<!-- Challenge Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white">
						<div class="flex items-center gap-3 mb-4">
							<div class="text-4xl">🏆</div>
							<div>
								<p class="text-xs font-medium opacity-80">
									Daily Design Challenge
								</p>
								<h3 class="text-xl font-bold">{{ todayChallenge.title }}</h3>
							</div>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<span class="px-2 py-1 bg-white/20 rounded-full">{{
								todayChallenge.difficulty
							}}</span>
							<span class="px-2 py-1 bg-white/20 rounded-full">{{
								todayChallenge.timeEstimate
							}}</span>
							<span class="px-2 py-1 bg-white/20 rounded-full">{{
									todayChallenge.completedBy
								}} completed</span>
						</div>
					</div>

					<!-- Content -->
					<div class="p-6 space-y-4">
						<div>
							<h4 class="font-medium text-gray-900 dark:text-white mb-2">
								Challenge Description
							</h4>
							<p class="text-sm text-gray-600 dark:text-gray-400">
								{{ todayChallenge.description }}
							</p>
						</div>

						<!-- Theme & Palette -->
						<div>
							<h4 class="font-medium text-gray-900 dark:text-white mb-2">
								Theme: {{ todayChallenge.theme }}
							</h4>
							<div class="flex gap-2">
								<div
									v-for="color in todayChallenge.colorPalette"
									:key="color"
									class="w-12 h-12 rounded-lg shadow-sm"
									:style="{ backgroundColor: color }"
									:title="color"
								/>
							</div>
						</div>

						<!-- Inspiration -->
						<div>
							<h4 class="font-medium text-gray-900 dark:text-white mb-2">
								Inspiration
							</h4>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="brand in todayChallenge.inspiration"
									:key="brand"
									class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
								>
									{{ brand }}
								</span>
							</div>
						</div>

						<!-- Progress/Completion -->
						<div
							v-if="hasCompleted"
							class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"
						>
							<div class="text-4xl mb-2">✅</div>
							<p class="font-medium text-green-700 dark:text-green-300">
								Challenge Completed!
							</p>
							<p class="text-sm text-green-600 dark:text-green-400">
								Great job on your design!
							</p>
						</div>
					</div>

					<!-- Footer -->
					<div class="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
						<button
							v-if="!hasCompleted"
							class="flex-1 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
							@click="startChallenge"
						>
							Start Challenge
						</button>
						<button
							v-else
							class="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
							@click="isOpen = false"
						>
							View My Submission
						</button>
						<button
							class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
							@click="isOpen = false"
						>
							Later
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
