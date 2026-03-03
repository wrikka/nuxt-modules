import type { Invitation, InvitationCreateData } from "../shared/types/invitations"

export const useWorkOSInvitations = () => {
	const createInvitation = async (data: InvitationCreateData): Promise<Invitation> => {
		const session = await $fetch<{ userId: string }>("/api/workos/sessions/current")

		const invitation: Omit<Invitation, "id" | "token" | "createdAt"> = {
			email: data.email,
			organizationId: data.organizationId,
			organizationName: "", // Will be filled by server
			roleId: data.roleId,
			roleName: "", // Will be filled by server
			invitedBy: session.userId,
			invitedByName: "", // Will be filled by server
			status: "pending",
			expiresAt: new Date(Date.now() + (data.expiresIn || 7 * 24 * 60 * 60 * 1000)).toISOString(),
			customMessage: data.customMessage,
		}

		return await $fetch("/api/workos/invitations", {
			method: "POST",
			body: invitation,
		})
	}

	const getInvitations = async (
		organizationId?: string,
		status?: Invitation["status"],
	): Promise<Invitation[]> => {
		const params = new URLSearchParams()
		if (organizationId) params.append("organizationId", organizationId)
		if (status) params.append("status", status)

		return await $fetch(`/api/workos/invitations?${params.toString()}`)
	}

	const getInvitation = async (token: string): Promise<Invitation> => {
		return await $fetch(`/api/workos/invitations/${token}`)
	}

	const acceptInvitation = async (token: string, userData?: {
		firstName?: string
		lastName?: string
	}): Promise<{
		user: any
		session: any
	}> => {
		return await $fetch(`/api/workos/invitations/${token}/accept`, {
			method: "POST",
			body: userData,
		})
	}

	const declineInvitation = async (token: string): Promise<void> => {
		await $fetch(`/api/workos/invitations/${token}/decline`, {
			method: "POST",
		})
	}

	const resendInvitation = async (id: string): Promise<Invitation> => {
		return await $fetch(`/api/workos/invitations/${id}/resend`, {
			method: "POST",
		})
	}

	const cancelInvitation = async (id: string): Promise<void> => {
		await $fetch(`/api/workos/invitations/${id}`, {
			method: "DELETE",
		})
	}

	const updateInvitation = async (
		id: string,
		updates: Partial<Invitation>,
	): Promise<Invitation> => {
		return await $fetch(`/api/workos/invitations/${id}`, {
			method: "PUT",
			body: updates,
		})
	}

	const getInvitationStats = async (organizationId?: string): Promise<{
		total: number
		pending: number
		accepted: number
		declined: number
		expired: number
	}> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch(`/api/workos/invitations/stats${query}`)
	}

	return {
		createInvitation,
		getInvitations,
		getInvitation,
		acceptInvitation,
		declineInvitation,
		resendInvitation,
		cancelInvitation,
		updateInvitation,
		getInvitationStats,
	}
}
