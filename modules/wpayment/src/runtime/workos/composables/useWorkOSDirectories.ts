import type { Directory } from "@workos-inc/node"
import { ensureServer, useWorkOS } from "./useWorkOSCore"

export const useWorkOSDirectories = () => {
	const { server } = useWorkOS()

	const listDirectories = async (options?: {
		limit?: number
		before?: string
		after?: string
		organizationId?: string
	}) => {
		const serverInstance = ensureServer(server)
		return await serverInstance.directorySync.listDirectories(options)
	}

	const getDirectory = async (id: string): Promise<Directory> => {
		const serverInstance = ensureServer(server)
		return await serverInstance.directorySync.getDirectory(id)
	}

	const deleteDirectory = async (id: string) => {
		const serverInstance = ensureServer(server)
		await serverInstance.directorySync.deleteDirectory(id)
	}

	return {
		listDirectories,
		getDirectory,
		deleteDirectory,
	}
}
