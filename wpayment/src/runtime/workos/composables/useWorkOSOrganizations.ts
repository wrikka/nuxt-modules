import type { Organization } from "@workos-inc/node"
import { ensureServer, useWorkOS } from "./useWorkOSCore"

export const useWorkOSOrganizations = () => {
	const { server } = useWorkOS()

	const createOrganization = async (data: {
		name: string
		domainData?: Array<{ domain: string; state: "verified" | "pending" | "not_started" }>
		allowProfilesOutsideOrganization?: boolean
	}) => {
		const serverInstance = ensureServer(server)
		return await serverInstance.organizations.createOrganization(
			data as Parameters<typeof serverInstance.organizations.createOrganization>[0],
		)
	}

	const getOrganization = async (id: string): Promise<Organization> => {
		const serverInstance = ensureServer(server)
		return await serverInstance.organizations.getOrganization(id)
	}

	const listOrganizations = async (options?: {
		limit?: number
		before?: string
		after?: string
		domains?: string[]
	}) => {
		const serverInstance = ensureServer(server)
		return await serverInstance.organizations.listOrganizations(options)
	}

	const deleteOrganization = async (id: string) => {
		const serverInstance = ensureServer(server)
		await serverInstance.organizations.deleteOrganization(id)
	}

	return {
		createOrganization,
		getOrganization,
		listOrganizations,
		deleteOrganization,
	}
}
