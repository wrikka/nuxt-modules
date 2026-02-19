import type { TeamMember, ActivityLog, Mention } from "~/shared/types/features"
import type { Task } from "~/shared/types/task"

/**
 * Composable for Team Collaboration features
 */
export const useTeamCollaboration = () => {
	const { $toast } = useNuxtApp()

	const teamMembers = useState<TeamMember[]>("team-members", () => [])
	const activityLog = useState<ActivityLog[]>("activity-log", () => [])
	const mentions = useState<Mention[]>("mentions", () => [])
	const onlineUsers = useState<string[]>("online-users", () => [])

	/**
	 * Fetch team members
	 */
	const fetchTeamMembers = async () => {
		const { data } = await useFetch<TeamMember[]>("/api/team/members")
		if (data.value) teamMembers.value = data.value
	}

	/**
	 * Fetch activity log
	 */
	const fetchActivityLog = async (taskId?: string, limit = 50) => {
		const { data } = await useFetch<ActivityLog[]>("/api/team/activity", {
			params: { taskId, limit },
		})
		if (data.value) activityLog.value = data.value
	}

	/**
	 * Fetch mentions for current user
	 */
	const fetchMentions = async () => {
		const { data } = await useFetch<Mention[]>("/api/team/mentions")
		if (data.value) mentions.value = data.value
	}

	/**
	 * Mark mention as read
	 */
	const markMentionAsRead = async (mentionId: string) => {
		const { error } = await useFetch(`/api/team/mentions/${mentionId}/read`, { method: "POST" })
		if (!error.value) {
			const mention = mentions.value.find(m => m.id === mentionId)
			if (mention) mention.read = true
		}
	}

	/**
	 * Parse @mentions from text
	 */
	const parseMentions = (text: string): string[] => {
		const mentionRegex = /@(\w+)/g
		const matches = text.match(mentionRegex) || []
		return matches.map(m => m.slice(1)) // Remove @
	}

	/**
	 * Handle @mention in comment
	 */
	const handleMention = async (taskId: string, commentText: string, commentId: string) => {
		const mentionedUsers = parseMentions(commentText)
		if (mentionedUsers.length === 0) return

		const { error } = await useFetch("/api/team/mentions", {
			method: "POST",
			body: {
				taskId,
				commentId,
				mentionedUsers,
			},
		})

		if (error.value) {
			console.error("Failed to create mentions:", error.value)
		}
	}

	/**
	 * Subscribe to real-time presence updates
	 */
	const subscribeToPresence = () => {
		// TODO: Implement WebSocket or SSE for real-time updates
		// For now, polling every 30 seconds
		setInterval(async () => {
			const { data } = await useFetch<string[]>("/api/team/online")
			if (data.value) onlineUsers.value = data.value
		}, 30000)
	}

	/**
	 * Get user status
	 */
	const getUserStatus = (userId: string): TeamMember["status"] => {
		const member = teamMembers.value.find(m => m.id === userId)
		if (!member) return "offline"

		// Check if online based on presence
		if (onlineUsers.value.includes(userId)) {
			return member.status
		}
		return "offline"
	}

	/**
	 * Get status color
	 */
	const getStatusColor = (status: TeamMember["status"]): string => {
		const colors: Record<TeamMember["status"], string> = {
			online: "bg-green-500",
			away: "bg-yellow-500",
			busy: "bg-red-500",
			offline: "bg-gray-400",
		}
		return colors[status]
	}

	/**
	 * Assign multiple users to task
	 */
	const assignMultiple = async (taskId: string, userIds: string[]) => {
		const { error } = await useFetch(`/api/tasks/${taskId}/assignees`, {
			method: "PATCH",
			body: { userIds },
		})

		if (error.value) {
			$toast.error("Failed to update assignees")
			return false
		}

		$toast.success("Assignees updated")
		return true
	}

	return {
		teamMembers: readonly(teamMembers),
		activityLog: readonly(activityLog),
		mentions: readonly(mentions),
		onlineUsers: readonly(onlineUsers),
		fetchTeamMembers,
		fetchActivityLog,
		fetchMentions,
		markMentionAsRead,
		parseMentions,
		handleMention,
		subscribeToPresence,
		getUserStatus,
		getStatusColor,
		assignMultiple,
	}
}
