// Export WorkOS types directly from @workos-inc/node
export type {
	AuthenticationResponse,
	AuthenticationResponseResponse,
	Connection,
	ConnectionResponse,
	Directory,
	DirectoryGroup,
	DirectoryGroupResponse,
	DirectoryResponse,
	DirectoryUser,
	DirectoryUserResponse,
	EmailVerification,
	EmailVerificationResponse,
	EnvironmentRole,
	EnvironmentRoleResponse,
	Event,
	EventName,
	EventResponse,
	Factor,
	FactorResponse,
	Invitation,
	InvitationResponse,
	MagicAuth,
	MagicAuthResponse,
	OauthTokens,
	OauthTokensResponse,
	Organization,
	OrganizationMembership,
	OrganizationMembershipResponse,
	OrganizationResponse,
	OrganizationRole,
	OrganizationRoleResponse,
	PasswordReset,
	PasswordResetResponse,
	Permission,
	PermissionResponse,
	Profile,
	ProfileResponse,
	Role,
	RoleResponse,
	Session,
	SessionResponse,
	SessionStatus,
	User,
	UserResponse,
} from "@workos-inc/node"

// Custom types that extend WorkOS types
export interface WorkOSSession {
	id: string
	userId: string
	organizationId: string
	organizationName: string
	role: string
	permissions: string[]
	isActive: boolean
	createdAt: string
	lastAccessAt: string
	expiresAt: string
}

export interface WorkOSAuthorizationURL {
	url: string
}

export interface WorkOSAccessToken {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token?: string
}

// Feature types
export * from "./advanced"
export * from "./audit"
export * from "./invitations"
export * from "./middleware"
export * from "./presence"
export * from "./rbac"
export * from "./sessions"
export * from "./webhooks"

// Dashboard types
export * from "./dashboard"
export * from "./role-builder"
export * from "./webhook-monitor"
