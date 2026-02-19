import type { RateLimitConfig, RateLimitResult } from "../../../shared/types/rate-limit";

export class RateLimiter {
	private requests: Map<string, number[]> = new Map();
	private config: RateLimitConfig;

	constructor(config: RateLimitConfig) {
		this.config = config;
	}

	check(identifier: string): RateLimitResult {
		const now = Date.now();
		const windowStart = now - this.config.windowMs;

		const userRequests = this.requests.get(identifier) || [];
		const validRequests = userRequests.filter(timestamp => timestamp > windowStart);

		this.requests.set(identifier, validRequests);

		const remaining = Math.max(0, this.config.maxRequests - validRequests.length);
		const resetAt = now + this.config.windowMs;

		if (validRequests.length >= this.config.maxRequests) {
			return {
				allowed: false,
				remaining: 0,
				resetAt,
			};
		}

		validRequests.push(now);
		this.requests.set(identifier, validRequests);

		return {
			allowed: true,
			remaining,
			resetAt,
		};
	}

	reset(identifier: string): void {
		this.requests.delete(identifier);
	}

	cleanup(): void {
		const now = Date.now();
		const windowStart = now - this.config.windowMs;

		for (const [identifier, requests] of this.requests.entries()) {
			const validRequests = requests.filter(timestamp => timestamp > windowStart);
			if (validRequests.length === 0) {
				this.requests.delete(identifier);
			} else {
				this.requests.set(identifier, validRequests);
			}
		}
	}
}

let instance: RateLimiter | null = null;

export function getRateLimiter(config?: RateLimitConfig): RateLimiter {
	if (!instance) {
		instance = new RateLimiter(config || { maxRequests: 100, windowMs: 60000 });
	}
	return instance;
}
