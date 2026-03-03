export interface UserPresence {
	userId: string
	organizationId?: string
	status: "online" | "offline" | "away" | "busy"
	lastSeen: string
	currentSession?: string
	deviceInfo?: {
		type: "desktop" | "mobile" | "tablet"
		os: string
		browser: string
	}
	location?: {
		country: string
		city: string
		timezone: string
	}
}

export interface PresenceUpdate {
	status: UserPresence["status"]
	deviceInfo?: UserPresence["deviceInfo"]
}
