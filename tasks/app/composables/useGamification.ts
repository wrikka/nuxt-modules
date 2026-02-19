import type { UserGamification } from "~/shared/types/features"

/**
 * Composable for Gamification
 */
export const useGamification = () => {
	const { $toast } = useNuxtApp()

	const userStats = useState<UserGamification | null>("user-gamification", () => null)
	const leaderboard = useState<{ userId: string; name: string; points: number; level: number }[]>("leaderboard", () => [])

	/**
	 * Fetch user gamification stats
	 */
	const fetchUserStats = async () => {
		const { data } = await useFetch<UserGamification>("/api/gamification/stats")
		if (data.value) userStats.value = data.value
	}

	/**
	 * Fetch leaderboard
	 */
	const fetchLeaderboard = async () => {
		const { data } = await useFetch<{ userId: string; name: string; points: number; level: number }[]>("/api/gamification/leaderboard")
		if (data.value) leaderboard.value = data.value
	}

	/**
	 * Award points for action
	 */
	const awardPoints = async (action: string, points: number) => {
		const { data, error } = await useFetch<UserGamification>("/api/gamification/award", {
			method: "POST",
			body: { action, points },
		})

		if (!error.value && data.value) {
			userStats.value = data.value

			// Check for level up
			const prevLevel = userStats.value?.level || 0
			if (data.value.level > prevLevel) {
				$toast.success(`Level Up! You're now level ${data.value.level}`)
			}
		}
	}

	/**
	 * Get badge icon
	 */
	const getBadgeIcon = (badgeName: string): string => {
		const icons: Record<string, string> = {
			"First Task": "mdi:star",
			"Task Master": "mdi:crown",
			"Speed Demon": "mdi:lightning-bolt",
			"Team Player": "mdi:account-group",
			"Time Keeper": "mdi:clock",
			"Bug Hunter": "mdi:bug",
			"Creative": "mdi:palette",
			"Productivity": "mdi:chart-line",
		}
		return icons[badgeName] || "mdi:medal"
	}

	/**
	 * Get points for action
	 */
	const getActionPoints = (action: string): number => {
		const points: Record<string, number> = {
			task_created: 10,
			task_completed: 50,
			task_completed_early: 75,
			comment_added: 5,
			helped_teammate: 25,
			streak_7_days: 100,
			streak_30_days: 500,
		}
		return points[action] || 10
	}

	/**
	 * Calculate level from points
	 */
	const calculateLevel = (points: number): number => {
		// Exponential level curve
		return Math.floor(Math.sqrt(points / 100)) + 1
	}

	/**
	 * Get next level threshold
	 */
	const getNextLevelThreshold = (currentLevel: number): number => {
		return Math.pow(currentLevel, 2) * 100
	}

	/**
	 * Get progress to next level
	 */
	const levelProgress = computed(() => {
		if (!userStats.value) return 0
		const current = userStats.value.points
		const level = userStats.value.level
		const nextThreshold = getNextLevelThreshold(level)
		const prevThreshold = getNextLevelThreshold(level - 1)
		return ((current - prevThreshold) / (nextThreshold - prevThreshold)) * 100
	})

	return {
		userStats: readonly(userStats),
		leaderboard: readonly(leaderboard),
		levelProgress,
		fetchUserStats,
		fetchLeaderboard,
		awardPoints,
		getBadgeIcon,
		getActionPoints,
		calculateLevel,
		getNextLevelThreshold,
	}
}
