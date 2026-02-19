import { readonly, ref } from "vue"

export interface Reaction {
	emoji: string
	count: number
	users: string[]
}

export function useReactions() {
	const reactions = ref<Map<string, Reaction[]>>(new Map())

	const commonEmojis = ["👍", "👎", "😄", "🎉", "😕", "❤️", "🚀", "👀"]

	function getReactions(entityId: string): Reaction[] {
		return reactions.value.get(entityId) || []
	}

	function addReaction(entityId: string, emoji: string, userId: string): void {
		const entityReactions = reactions.value.get(entityId) || []
		const existing = entityReactions.find(r => r.emoji === emoji)

		if (existing) {
			if (!existing.users.includes(userId)) {
				existing.users.push(userId)
				existing.count++
			}
		}
		else {
			entityReactions.push({
				emoji,
				count: 1,
				users: [userId],
			})
		}

		reactions.value.set(entityId, entityReactions)
	}

	function removeReaction(entityId: string, emoji: string, userId: string): void {
		const entityReactions = reactions.value.get(entityId) || []
		const existing = entityReactions.find(r => r.emoji === emoji)

		if (existing) {
			const userIndex = existing.users.indexOf(userId)
			if (userIndex !== -1) {
				existing.users.splice(userIndex, 1)
				existing.count--

				if (existing.count === 0) {
					const index = entityReactions.indexOf(existing)
					entityReactions.splice(index, 1)
				}
			}
		}

		reactions.value.set(entityId, entityReactions)
	}

	function hasReacted(entityId: string, emoji: string, userId: string): boolean {
		const entityReactions = reactions.value.get(entityId) || []
		const existing = entityReactions.find(r => r.emoji === emoji)
		return existing?.users.includes(userId) || false
	}

	function toggleReaction(entityId: string, emoji: string, userId: string): void {
		if (hasReacted(entityId, emoji, userId)) {
			removeReaction(entityId, emoji, userId)
		}
		else {
			addReaction(entityId, emoji, userId)
		}
	}

	function getTotalReactions(entityId: string): number {
		return getReactions(entityId).reduce((sum, r) => sum + r.count, 0)
	}

	return {
		commonEmojis: readonly(commonEmojis),
		getReactions,
		addReaction,
		removeReaction,
		hasReacted,
		toggleReaction,
		getTotalReactions,
	}
}
