import type { H3Event } from 'h3';
import { getHeader } from 'h3';

interface RateLimitStore {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (event: H3Event) => string;
}

const stores = new Map<string, RateLimitStore>();

export const createRateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxRequests, keyGenerator } = options;

  const defaultKeyGenerator = (event: H3Event): string => {
    const ip = getHeader(event, 'x-forwarded-for') ?? getHeader(event, 'x-real-ip') ?? 'unknown';
    return ip;
  };

  const getKey = (event: H3Event): string => {
    const baseKey = keyGenerator ? keyGenerator(event) : defaultKeyGenerator(event);
    const path = event.path;
    return `${baseKey}:${path}`;
  };

  const check = (event: H3Event): { allowed: boolean; remaining: number; resetAt: number; } => {
    const key = getKey(event);
    const now = Date.now();
    let store = stores.get(key);

    if (!store || now > store.resetAt) {
      store = { count: 0, resetAt: now + windowMs };
      stores.set(key, store);
    }

    store.count++;
    const remaining = Math.max(0, maxRequests - store.count);
    const allowed = store.count <= maxRequests;

    return { allowed, remaining, resetAt: store.resetAt };
  };

  const cleanup = () => {
    const now = Date.now();
    for (const [key, store] of stores.entries()) {
      if (now > store.resetAt) {
        stores.delete(key);
      }
    }
  };

  // Cleanup every minute
  setInterval(cleanup, 60000);

  return { check };
};

export const webhookRateLimiter = createRateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100, // 100 requests per minute per IP
});
