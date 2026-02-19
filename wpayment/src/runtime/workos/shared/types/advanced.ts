export interface PasswordPolicy {
	id: string
	organizationId: string
	minLength: number
	requireUppercase: boolean
	requireLowercase: boolean
	requireNumbers: boolean
	requireSpecialChars: boolean
	preventCommonPasswords: boolean
	maxAge: number
	historyCount: number
	lockoutThreshold: number
	lockoutDuration: number
	createdAt: string
	updatedAt: string
}

export interface Device {
	id: string
	userId: string
	name: string
	type: "desktop" | "mobile" | "tablet"
	platform: string
	userAgent: string
	lastUsedAt: string
	isTrusted: boolean
	ipAddress: string
	location?: {
		country: string
		city: string
	}
	createdAt: string
}

export interface AnalyticsData {
	userGrowth: Array<{
		date: string
		count: number
	}>
	loginActivity: Array<{
		date: string
		logins: number
		uniqueUsers: number
	}>
	organizationMetrics: Array<{
		organizationId: string
		name: string
		userCount: number
		activeUsers: number
		sessionCount: number
	}>
	securityEvents: Array<{
		date: string
		type: string
		count: number
	}>
}

export interface EmailTemplate {
	id: string
	name: string
	type: "invitation" | "password_reset" | "welcome" | "notification"
	subject: string
	htmlContent: string
	textContent: string
	variables: string[]
	organizationId?: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export interface BackupConfig {
	id: string
	name: string
	type: "full" | "incremental"
	schedule: string
	retention: number
	destinations: Array<{
		type: "s3" | "local" | "ftp"
		config: Record<string, unknown>
	}>
	isActive: boolean
	lastBackupAt?: string
	createdAt: string
}

export interface ThemeConfig {
	id: string
	organizationId?: string
	name: string
	primaryColor: string
	secondaryColor: string
	accentColor: string
	backgroundColor: string
	textColor: string
	logoUrl?: string
	faviconUrl?: string
	customCSS?: string
	isActive: boolean
	isDefault: boolean
	createdAt: string
	updatedAt: string
}

export interface ComplianceReport {
	id: string
	name: string
	type: "GDPR" | "SOC2" | "HIPAA" | "ISO27001"
	status: "pending" | "generating" | "completed" | "failed"
	generatedAt?: string
	downloadUrl?: string
	config: Record<string, unknown>
	organizationId?: string
	createdAt: string
}

export interface Integration {
	id: string
	name: string
	description: string
	category: string
	logoUrl: string
	version: string
	author: string
	documentationUrl: string
	configSchema: Record<string, unknown>
	isActive: boolean
	isInstalled: boolean
	installationCount: number
	rating: number
	createdAt: string
	updatedAt: string
}
