export interface Invitation {
	id: string
	email: string
	organizationId: string
	organizationName: string
	roleId: string
	roleName: string
	invitedBy: string
	invitedByName: string
	status: "pending" | "accepted" | "declined" | "expired"
	token: string
	expiresAt: string
	acceptedAt?: string
	declinedAt?: string
	createdAt: string
	customMessage?: string
}

export interface InvitationCreateData {
	email: string
	organizationId: string
	roleId: string
	customMessage?: string
	expiresIn?: number
}
