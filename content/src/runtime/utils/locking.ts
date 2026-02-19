// Stub for locking utility
export function getContentLockManager() {
	return {
		acquireLock: (_path: string, _userId: string, _userName: string, _duration?: number) => ({ acquired: true }),
		releaseLock: (_path: string, _userId: string) => ({ released: true }),
		getLock: (_path: string) => ({ locked: false }),
	};
}
export function acquireLock() {
	return { acquired: true };
}
export function releaseLock() {
	return { released: true };
}
export function getLock() {
	return { locked: false };
}
