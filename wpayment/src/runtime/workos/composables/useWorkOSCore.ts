import type { WorkOSOptions } from "@workos-inc/node"
import { WorkOS } from "@workos-inc/node"

const createServerInstance = () => {
	if (!import.meta.server) return null

	const config = useRuntimeConfig()
	const workosConfig = config.workos as { apiKey: string }
	const publicConfig = config.public.workos as { baseUrl?: string }
	return new WorkOS(workosConfig.apiKey, {
		baseURL: publicConfig.baseUrl,
	} as WorkOSOptions)
}

const createClientInstance = () => {
	const config = useRuntimeConfig()
	const publicConfig = config.public.workos as { clientId?: string; baseUrl?: string }
	return new WorkOS(publicConfig.clientId || "", {
		apiKey: "",
		baseURL: publicConfig.baseUrl,
	} as WorkOSOptions)
}

export const ensureServer = (server: ReturnType<typeof createServerInstance>) => {
	if (!server) {
		throw new Error("This function can only be called on the server")
	}
	return server
}

export const useWorkOS = () => {
	const config = useRuntimeConfig()
	const server = createServerInstance()
	const client = createClientInstance()

	return {
		client,
		server,
		config: config.public.workos as { clientId?: string; baseUrl?: string; environment?: string },
	}
}
