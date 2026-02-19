<script setup lang="ts">
const {
	userStats,
	leaderboard,
	fetchUserStats,
	fetchLeaderboard,
	awardPoints,
	getBadgeIcon,
	getActionPoints,
	calculateLevel,
	getNextLevelThreshold,
	levelProgress,
} = useGamification()

const activeTab = ref<"overview" | "badges" | "leaderboard">("overview")

onMounted(() => {
	fetchUserStats()
	fetchLeaderboard()
})
</script>

<template>
	<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
		<!-- Tabs -->
		<div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
			<button
				v-for="tab in ['overview', 'badges', 'leaderboard']"
				:key="tab"
				class="px-4 py-3 text-sm font-medium capitalize"
				:class="activeTab === tab
					? 'text-purple-600 border-b-2 border-purple-600'
					: 'text-gray-600 dark:text-gray-400'"
				@click="activeTab = tab as typeof activeTab"
			>
				{{ tab }}
			</button>
		</div>

		<!-- Overview Tab -->
		<div v-if="activeTab === 'overview' && userStats" class="space-y-6">
			<!-- Level & Points -->
			<div class="flex items-center gap-6">
				<div class="relative w-24 h-24">
					<svg class="w-full h-full -rotate-90">
						<circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="8" fill="none" />
						<circle
							cx="48"
							cy="48"
							r="40"
							stroke="currentColor"
							stroke-width="8"
							fill="none"
							stroke-linecap="round"
							class="text-purple-500"
							:stroke-dasharray="251.2"
							:stroke-dashoffset="251.2 * (1 - levelProgress / 100)"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-2xl font-bold text-purple-600">{{ userStats.level }}</span>
					</div>
				</div>
				<div>
					<p class="text-sm text-gray-500">Level {{ userStats.level }}</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ userStats.points.toLocaleString() }} XP</p>
					<p class="text-xs text-gray-500">
						{{ getNextLevelThreshold(userStats.level) - userStats.points }} XP to next level
					</p>
				</div>
			</div>

			<!-- Streak -->
			<div class="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
				<Icon name="mdi:fire" class="w-8 h-8 text-orange-500" />
				<div>
					<p class="font-medium text-gray-900 dark:text-white">
						{{ userStats.streak.current }} day streak!
					</p>
					<p class="text-sm text-gray-500">
						Longest: {{ userStats.streak.longest }} days
					</p>
				</div>
			</div>

			<!-- Stats Grid -->
			<div class="grid grid-cols-3 gap-4">
				<div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
					<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ userStats.stats.tasks_completed || 0 }}</p>
					<p class="text-sm text-gray-500">Tasks Done</p>
				</div>
				<div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
					<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ userStats.badges.length }}</p>
					<p class="text-sm text-gray-500">Badges</p>
				</div>
				<div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
					<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ userStats.stats.time_tracked || 0 }}h</p>
					<p class="text-sm text-gray-500">Time Tracked</p>
				</div>
			</div>
		</div>

		<!-- Badges Tab -->
		<div v-if="activeTab === 'badges'" class="grid grid-cols-4 gap-4">
			<div
				v-for="badge in userStats?.badges"
				:key="badge.id"
				class="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg text-center"
			>
				<Icon :name="getBadgeIcon(badge.name)" class="w-10 h-10 text-purple-500 mx-auto mb-2" />
				<p class="font-medium text-gray-900 dark:text-white text-sm">{{ badge.name }}</p>
				<p class="text-xs text-gray-500">{{ badge.description }}</p>
			</div>
		</div>

		<!-- Leaderboard Tab -->
		<div v-if="activeTab === 'leaderboard'" class="space-y-2">
			<div
				v-for="(user, index) in leaderboard.slice(0, 10)"
				:key="user.userId"
				class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
				:class="{ 'bg-yellow-50 dark:bg-yellow-900/20': index < 3 }"
			>
				<span class="w-8 text-center font-bold" :class="{
					'text-yellow-500': index === 0,
					'text-gray-400': index === 1,
					'text-amber-600': index === 2,
					'text-gray-500': index > 2
				}">
					{{ index + 1 }}
				</span>
				<div class="flex-1">
					<p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
					<p class="text-sm text-gray-500">Level {{ user.level }}</p>
				</div>
				<p class="font-bold text-purple-600">{{ user.points.toLocaleString() }} XP</p>
			</div>
		</div>
	</div>
</template>
