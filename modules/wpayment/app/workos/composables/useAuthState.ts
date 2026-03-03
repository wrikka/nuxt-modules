import { type DeepReadonly, effectScope, type Reactive, reactive, readonly } from "vue"

export interface AuthUser {
	id: string
	email: string
	firstName?: string
	lastName?: string
	profilePictureUrl?: string
	role?: string
	permissions?: string[]
	organizationId?: string
	organizationName?: string
}

export interface AuthTokens {
	accessToken: string
	refreshToken?: string
	expiresAt: number
	tokenType: string
}

export interface AuthState {
	user: AuthUser | null
	tokens: AuthTokens | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	lastChecked: number | null
}

interface AuthActions {
	login: (email: string, password: string) => Promise<void>
	loginWithSSO: (provider: string, redirectUri?: string) => Promise<void>
	loginWithMagicLink: (email: string) => Promise<void>
	logout: () => Promise<void>
	refreshSession: () => Promise<void>
	checkSession: () => Promise<boolean>
	hasPermission: (permission: string) => boolean
	hasRole: (role: string) => boolean
	hasAnyPermission: (permissions: string[]) => boolean
	hasAllPermissions: (permissions: string[]) => boolean
	switchOrganization: (organizationId: string) => Promise<void>
	updateUser: (updates: Partial<AuthUser>) => void
	clearError: () => void
}

type AuthStore = DeepReadonly<Reactive<AuthState>> & AuthActions

let authStore: AuthStore | null = null
let scope: ReturnType<typeof effectScope> | null = null

const initialState: AuthState = {
	user: null,
	tokens: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
	lastChecked: null,
}

/**
 * Create and configure the auth state provider
 */
// Internal mutable state reference
let internalState: Reactive<AuthState> | null = null

function createAuthStore(): AuthStore {
	const state = reactive<AuthState>({ ...initialState })
	internalState = state

	const actions: AuthActions = {
		async login(email: string, password: string) {
			state.isLoading = true
			state.error = null

			try {
				const response = await $fetch<{ user: AuthUser; tokens: AuthTokens }>("/api/auth/login", {
					method: "POST",
					body: { email, password },
				})

				state.user = response.user
				state.tokens = response.tokens
				state.isAuthenticated = true
				state.lastChecked = Date.now()
			} catch (err: any) {
				state.error = err.data?.message || "Login failed"
				throw err
			} finally {
				state.isLoading = false
			}
		},

		async loginWithSSO(provider: string, redirectUri?: string) {
			state.isLoading = true
			state.error = null

			try {
				const response = await $fetch<{ url: string }>("/api/auth/sso", {
					query: { provider, redirectUri },
				})

				window.location.href = response.url
			} catch (err: any) {
				state.error = err.data?.message || "SSO login failed"
				state.isLoading = false
				throw err
			}
		},

		async loginWithMagicLink(email: string) {
			state.isLoading = true
			state.error = null

			try {
				await $fetch("/api/auth/magic-link", {
					method: "POST",
					body: { email },
				})

				state.error = "Magic link sent! Check your email."
			} catch (err: any) {
				state.error = err.data?.message || "Failed to send magic link"
				throw err
			} finally {
				state.isLoading = false
			}
		},

		async logout() {
			state.isLoading = true

			try {
				if (state.tokens?.accessToken) {
					await $fetch("/api/auth/logout", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${state.tokens.accessToken}`,
						},
					})
				}
			} catch {
				// Ignore logout errors
			} finally {
				state.user = null
				state.tokens = null
				state.isAuthenticated = false
				state.isLoading = false
				state.lastChecked = null
			}
		},

		async refreshSession() {
			if (!state.tokens?.refreshToken) {
				return
			}

			try {
				const response = await $fetch<{ tokens: AuthTokens }>("/api/auth/refresh", {
					method: "POST",
					body: { refreshToken: state.tokens.refreshToken },
				})

				state.tokens = response.tokens
				state.lastChecked = Date.now()
			} catch {
				// Refresh failed, logout user
				await actions.logout()
			}
		},

		async checkSession() {
			if (!state.tokens?.accessToken) {
				state.isAuthenticated = false
				return false
			}

			// Check if token is expired
			if (state.tokens.expiresAt < Date.now()) {
				await actions.refreshSession()
			}

			try {
				const response = await $fetch<{ user: AuthUser }>("/api/auth/me", {
					headers: {
						Authorization: `Bearer ${state.tokens.accessToken}`,
					},
				})

				state.user = response.user
				state.isAuthenticated = true
				state.lastChecked = Date.now()
				return true
			} catch {
				state.isAuthenticated = false
				return false
			}
		},

		hasPermission(permission: string): boolean {
			if (!state.user?.permissions) return false
			return state.user.permissions.includes(permission)
		},

		hasRole(role: string): boolean {
			if (!state.user?.role) return false
			return state.user.role === role
		},

		hasAnyPermission(permissions: string[]): boolean {
			if (!state.user?.permissions) return false
			return permissions.some((p) => state.user!.permissions!.includes(p))
		},

		hasAllPermissions(permissions: string[]): boolean {
			if (!state.user?.permissions) return false
			return permissions.every((p) => state.user!.permissions!.includes(p))
		},

		async switchOrganization(organizationId: string) {
			if (!state.tokens?.accessToken) return

			state.isLoading = true

			try {
				const response = await $fetch<{ user: AuthUser; tokens: AuthTokens }>(
					"/api/auth/switch-org",
					{
						method: "POST",
						body: { organizationId },
						headers: {
							Authorization: `Bearer ${state.tokens.accessToken}`,
						},
					},
				)

				state.user = response.user
				state.tokens = response.tokens
			} catch (err: any) {
				state.error = err.data?.message || "Failed to switch organization"
				throw err
			} finally {
				state.isLoading = false
			}
		},

		updateUser(updates: Partial<AuthUser>) {
			if (state.user) {
				state.user = { ...state.user, ...updates }
			}
		},

		clearError() {
			state.error = null
		},
	}

	return readonly(state) as unknown as AuthStore & AuthActions
}

/**
 * Get the global auth store instance
 */
export function useAuthState(): AuthStore {
	if (authStore) {
		return authStore
	}

	// Create in effect scope for proper cleanup
	scope = effectScope()
	authStore = scope.run(() => createAuthStore()) as AuthStore

	return authStore
}

/**
 * Initialize auth state from stored session (SSR-safe)
 */
export async function initAuthState(): Promise<void> {
	// Ensure store is initialized
	useAuthState()

	// Skip if already checked recently
	if (internalState?.lastChecked && Date.now() - internalState.lastChecked < 60000) {
		return
	}

	// Try to restore from cookie/storage
	if (import.meta.server) {
		// Server-side: check session cookie
		const event = useRequestEvent()
		if (event && internalState) {
			const session = getCookie(event, "workos_session")
			if (session) {
				try {
					const data = JSON.parse(session)
					internalState.user = data.user
					internalState.tokens = data.tokens
					internalState.isAuthenticated = true
				} catch {
					// Invalid session
				}
			}
		}
	} else {
		// Client-side: check session
		if (internalState?.tokens?.accessToken) {
			await useAuthState().checkSession()
		}
	}
}

/**
 * Reset auth state (for testing)
 */
export function resetAuthState(): void {
	if (scope) {
		scope.stop()
		scope = null
	}
	authStore = null
}

// Export types
export type { AuthStore as AuthStoreType }
