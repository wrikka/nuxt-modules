import { ref, computed, type Ref } from 'vue'

export interface UserInfo {
	/** User ID */
	id: string
	/** Display name */
	name: string
	/** User email */
	email?: string
	/** Avatar URL */
	avatar?: string
	/** User initials (fallback for avatar) */
	initials?: string
	/** User role */
	role?: 'admin' | 'user' | 'guest'
	/** Online status */
	status?: 'online' | 'away' | 'busy' | 'offline'
}

export interface UseUserAvatarOptions {
	/** Initial user info */
	user?: UserInfo
	/** Palette ID */
	paletteId: string
	/** Show online indicator */
	showStatus?: boolean
	/** Avatar size in pixels */
	size?: number
}

export interface UseUserAvatarReturn {
	/** Current user info */
	user: Ref<UserInfo | null>
	/** Computed avatar URL or fallback */
	avatarUrl: Ref<string>
	/** Computed user initials */
	userInitials: Ref<string>
	/** Online status indicator */
	statusIndicator: Ref<string>
	/** Set current user */
	setUser: (user: UserInfo | null) => void
	/** Update user info */
	updateUser: (updates: Partial<UserInfo>) => void
	/** Load user from storage */
	loadUser: () => void
}

const STORAGE_KEY = 'palette-user'

/**
 * Generate initials from name
 */
function generateInitials(name: string): string {
	return name
		.split(' ')
		.map(n => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

/**
 * Generate avatar gradient based on user ID
 */
function generateAvatarGradient(userId: string): string {
	const hash = userId.split('').reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc)
	}, 0)

	const colors = [
		['#667eea', '#764ba2'],
		['#f093fb', '#f5576c'],
		['#4facfe', '#00f2fe'],
		['#43e97b', '#38f9d7'],
		['#fa709a', '#fee140'],
		['#a8edea', '#fed6e3'],
		['#d299c2', '#fef9d7'],
		['#89f7fe', '#66a6ff']
	]

	const colorPair = colors[Math.abs(hash) % colors.length]
	return `linear-gradient(135deg, ${colorPair[0]} 0%, ${colorPair[1]} 100%)`
}

export function useUserAvatar(options: UseUserAvatarOptions): UseUserAvatarReturn {
	const user = ref<UserInfo | null>(options.user ?? null)

	/**
	 * Computed avatar URL
	 */
	const avatarUrl = computed(() => {
		if (!user.value) return ''

		if (user.value.avatar) {
			return user.value.avatar
		}

		// Generate gradient avatar as fallback
		if (user.value.id) {
			return generateAvatarGradient(user.value.id)
		}

		return ''
	})

	/**
	 * Computed user initials
	 */
	const userInitials = computed(() => {
		if (!user.value) return '?'

		if (user.value.initials) {
			return user.value.initials
		}

		if (user.value.name) {
			return generateInitials(user.value.name)
		}

		return user.value.id.slice(0, 2).toUpperCase()
	})

	/**
	 * Status indicator color
	 */
	const statusIndicator = computed(() => {
		const status = user.value?.status ?? 'offline'
		const colors: Record<string, string> = {
			online: '#22c55e',
			away: '#f59e0b',
			busy: '#ef4444',
			offline: '#6b7280'
		}
		return colors[status] ?? colors.offline
	})

	/**
	 * Set current user
	 */
	const setUser = (newUser: UserInfo | null): void => {
		user.value = newUser
		if (newUser) {
			localStorage.setItem(`${STORAGE_KEY}-${options.paletteId}`, JSON.stringify(newUser))
		}
	}

	/**
	 * Update user info
	 */
	const updateUser = (updates: Partial<UserInfo>): void => {
		if (!user.value) return

		user.value = { ...user.value, ...updates }
		localStorage.setItem(`${STORAGE_KEY}-${options.paletteId}`, JSON.stringify(user.value))
	}

	/**
	 * Load user from storage
	 */
	const loadUser = (): void => {
		const stored = localStorage.getItem(`${STORAGE_KEY}-${options.paletteId}`)
		if (stored) {
			user.value = JSON.parse(stored)
		}
	}

	// Load on mount
	loadUser()

	return {
		user,
		avatarUrl,
		userInitials,
		statusIndicator,
		setUser,
		updateUser,
		loadUser
	}
}
