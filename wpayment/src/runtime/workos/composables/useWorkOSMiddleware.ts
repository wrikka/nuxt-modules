import type { H3Event } from "h3"
import type {
	CacheConfig,
	I18nConfig,
	RateLimitConfig,
	SecurityConfig,
} from "../shared/types/middleware"
import { generateMiddlewareId } from "../utils"

export const useWorkOSMiddleware = () => {
	// Rate Limiting
	const createRateLimit = async (config: RateLimitConfig): Promise<{
		id: string
		config: RateLimitConfig
	}> => {
		return await $fetch("/api/workos/middleware/rate-limit", {
			method: "POST",
			body: {
				...config,
				id: generateMiddlewareId(),
			},
		})
	}

	const checkRateLimit = async (key: string, endpoint: string): Promise<{
		allowed: boolean
		remaining: number
		resetTime: number
	}> => {
		return await $fetch("/api/workos/middleware/rate-limit/check", {
			method: "POST",
			body: { key, endpoint },
		})
	}

	// Caching
	const setCache = async (key: string, value: unknown, config?: CacheConfig): Promise<void> => {
		await $fetch("/api/workos/cache", {
			method: "POST",
			body: {
				key,
				value,
				config: {
					ttl: 3600, // 1 hour default
					...config,
				},
			},
		})
	}

	const getCache = async (key: string): Promise<unknown> => {
		try {
			return await $fetch(`/api/workos/cache/${key}`)
		} catch {
			return null
		}
	}

	const deleteCache = async (key: string): Promise<void> => {
		await $fetch(`/api/workos/cache/${key}`, {
			method: "DELETE",
		})
	}

	const clearCache = async (pattern?: string): Promise<{
		deletedCount: number
	}> => {
		return await $fetch("/api/workos/cache/clear", {
			method: "POST",
			body: { pattern },
		})
	}

	// Security Headers
	const addSecurityHeaders = (event: H3Event, config: SecurityConfig): void => {
		const headers: Record<string, string> = {}

		if (config.enableCSP) {
			headers["Content-Security-Policy"] =
				"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
		}

		if (config.enableHSTS) {
			headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
		}

		if (config.enableXFrameOptions) {
			headers["X-Frame-Options"] = "DENY"
		}

		if (config.enableXContentTypeOptions) {
			headers["X-Content-Type-Options"] = "nosniff"
		}

		if (config.customHeaders) {
			Object.assign(headers, config.customHeaders)
		}

		// Apply headers to response
		Object.entries(headers).forEach(([key, value]) => {
			event.node.res.setHeader(key, value)
		})
	}

	// i18n
	const getLocale = (event: H3Event, config: I18nConfig): string => {
		const acceptLanguage = event.node.req.headers["accept-language"] ?? ""
		const preferredLocale = acceptLanguage.split(",")[0]?.split("-")[0] ?? ""

		if (preferredLocale && config.supportedLocales.includes(preferredLocale)) {
			return preferredLocale
		}

		return config.defaultLocale
	}

	const translate = (key: string, locale: string, config: I18nConfig): string => {
		const messages = config.messages[locale] || config.messages[config.fallbackLocale] || {}
		return messages[key] || key
	}

	const setLocaleCookie = (event: H3Event, locale: string): void => {
		setCookie(event, "workos_locale", locale, {
			httpOnly: false,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 365 * 24 * 60 * 60, // 1 year
		})
	}

	// Mobile App Support
	const handleMobileDeepLink = (event: H3Event): {
		isMobile: boolean
		deepLink?: string
		platform?: "ios" | "android"
	} => {
		const userAgent = event.node.req.headers["user-agent"] || ""
		const isIOS = /iPhone|iPad|iPod/.test(userAgent)
		const isAndroid = /Android/.test(userAgent)

		if (isIOS || isAndroid) {
			const deepLink = getQuery(event).deep_link as string
			return {
				isMobile: true,
				deepLink,
				platform: isIOS ? "ios" : "android",
			}
		}

		return { isMobile: false }
	}

	const generateMobileAppLink = (path: string, platform: "ios" | "android"): string => {
		const appSchemes = {
			ios: `workosapp://${path}`,
			android: `workosapp://${path}`,
		}

		return appSchemes[platform]
	}

	// API Rate Limiting for WorkOS
	const workOSRateLimit = {
		check: async (endpoint: string): Promise<{
			allowed: boolean
			resetTime?: number
		}> => {
			const cacheKey = `workos_rate_limit_${endpoint}`
			const cached = await getCache(cacheKey)

			if (cached && typeof cached === "object") {
				const cacheData = cached as { remaining: number; resetTime: number }
				return {
					allowed: cacheData.remaining > 0,
					resetTime: cacheData.resetTime,
				}
			}

			return { allowed: true }
		},

		update: async (
			endpoint: string,
			limit: number,
			remaining: number,
			resetTime: number,
		): Promise<void> => {
			const cacheKey = `workos_rate_limit_${endpoint}`
			await setCache(cacheKey, {
				limit,
				remaining,
				resetTime,
			}, { ttl: Math.ceil((resetTime - Date.now()) / 1000) })
		},
	}

	return {
		// Rate Limiting
		createRateLimit,
		checkRateLimit,

		// Caching
		setCache,
		getCache,
		deleteCache,
		clearCache,

		// Security Headers
		addSecurityHeaders,

		// i18n
		getLocale,
		translate,
		setLocaleCookie,

		// Mobile App Support
		handleMobileDeepLink,
		generateMobileAppLink,

		// WorkOS Rate Limiting
		workOSRateLimit,
	}
}
