export interface RateLimitConfig {
	windowMs: number
	maxRequests: number
	skipSuccessfulRequests?: boolean
	skipFailedRequests?: boolean
	keyGenerator?: (event: unknown) => string
}

export interface CacheConfig {
	ttl: number
	keyPrefix?: string
	strategy?: "memory" | "redis" | "database"
	compression?: boolean
}

export interface SecurityConfig {
	enableCSP: boolean
	enableHSTS: boolean
	enableXFrameOptions: boolean
	enableXContentTypeOptions: boolean
	customHeaders?: Record<string, string>
}

export interface I18nConfig {
	defaultLocale: string
	supportedLocales: string[]
	fallbackLocale: string
	messages: Record<string, Record<string, string>>
}
