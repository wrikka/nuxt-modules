import type { User } from "@workos-inc/node"
import { ensureServer, useWorkOS } from "./useWorkOSCore"

export const useWorkOSAuth = () => {
	const { server } = useWorkOS()

	const getAuthorizationUrl = (options: {
		domain?: string
		provider?: string
		redirectUri: string
		state?: string
	}) => {
		const serverInstance = ensureServer(server)
		return serverInstance.userManagement.getAuthorizationUrl(options)
	}

	const authenticateWithCode = async (code: string) => {
		const serverInstance = ensureServer(server)
		const config = useRuntimeConfig()
		const publicConfig = config.public.workos as { clientId?: string }

		const { user, accessToken } = await serverInstance.userManagement.authenticateWithCode({
			code,
			clientId: publicConfig.clientId,
		})

		return { user, accessToken }
	}

	const logout = async (sessionId: string) => {
		const serverInstance = ensureServer(server)
		// Note: WorkOS logout is handled client-side by redirecting to logout URL
		// This function exists for API consistency
		return serverInstance.userManagement.getLogoutUrl({ sessionId })
	}

	const getUser = async (accessToken: string): Promise<User> => {
		const serverInstance = ensureServer(server)
		return await serverInstance.userManagement.getUser(accessToken)
	}

	const listUsers = async (options?: {
		limit?: number
		before?: string
		after?: string
		email?: string
		organizationId?: string
	}) => {
		const serverInstance = ensureServer(server)
		return await serverInstance.userManagement.listUsers(options)
	}

	return {
		getAuthorizationUrl,
		authenticateWithCode,
		logout,
		getUser,
		listUsers,
	}
}
