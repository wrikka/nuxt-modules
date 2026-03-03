import type { Connection, ConnectionType } from "@workos-inc/node"
import { ensureServer, useWorkOS } from "./useWorkOSCore"

export const useWorkOSConnections = () => {
	const { server } = useWorkOS()

	const listConnections = async (options?: {
		limit?: number
		before?: string
		after?: string
		organizationId?: string
		connectionType?: ConnectionType
		state?: "active" | "inactive"
	}) => {
		const serverInstance = ensureServer(server)
		return await serverInstance.sso.listConnections(options)
	}

	const getConnection = async (id: string): Promise<Connection> => {
		const serverInstance = ensureServer(server)
		return await serverInstance.sso.getConnection(id)
	}

	const deleteConnection = async (id: string) => {
		const serverInstance = ensureServer(server)
		await serverInstance.sso.deleteConnection(id)
	}

	return {
		listConnections,
		getConnection,
		deleteConnection,
	}
}
