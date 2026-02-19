<script setup lang="ts">
const { userStats, leaderboard, fetchUserStats, fetchLeaderboard } = useGamification()

onMounted(() => {
	fetchUserStats()
	fetchLeaderboard()
})
</script>

<template>
	<div class="p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
				<p class="text-gray-500">Track your progress and earn rewards</p>
			</div>
		</div>

		<GamificationPanel />
	</div>
</template>
