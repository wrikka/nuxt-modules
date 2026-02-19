export interface ContentLock {
	_path: string;
	_userId: string;
	userName: string;
	lockedAt: number;
	expiresAt: number;
}

export interface LockResult {
	success: boolean;
	lock?: ContentLock;
	error?: string;
}

export interface UnlockResult {
	success: boolean;
	error?: string;
}

export class ContentLockManager {
	private locks: Map<string, ContentLock> = new Map();
	private __lockTimeout = 30 * 60 * 1000; // 30 minutes default

	acquireLock(_path: string, _userId: string, userName: string, duration = 30 * 60 * 1000): LockResult {
		const existingLock = this.locks.get(_path);

		// Check if lock exists and hasn't expired
		if (existingLock && existingLock.expiresAt > Date.now()) {
			return {
				success: false,
				error: `Content is locked by ${existingLock.userName}`,
			};
		}

		const lock: ContentLock = {
			_path,
			_userId,
			userName,
			lockedAt: Date.now(),
			expiresAt: Date.now() + duration,
		};

		this.locks.set(_path, lock);

		return {
			success: true,
			lock,
		};
	}

	releaseLock(_path: string, _userId: string): UnlockResult {
		const lock = this.locks.get(_path);

		if (!lock) {
			return {
				success: false,
				error: "No lock found",
			};
		}

		if (lock._userId !== _userId) {
			return {
				success: false,
				error: "You do not own this lock",
			};
		}

		this.locks.delete(_path);

		return {
			success: true,
		};
	}

	extendLock(_path: string, _userId: string, duration = 30 * 60 * 1000): LockResult {
		const lock = this.locks.get(_path);

		if (!lock) {
			return {
				success: false,
				error: "No lock found",
			};
		}

		if (lock._userId !== _userId) {
			return {
				success: false,
				error: "You do not own this lock",
			};
		}

		lock.expiresAt = Date.now() + duration;
		this.locks.set(_path, lock);

		return {
			success: true,
			lock,
		};
	}

	getLock(_path: string): ContentLock | null {
		const lock = this.locks.get(_path);

		if (!lock || lock.expiresAt <= Date.now()) {
			if (lock) {
				this.locks.delete(_path);
			}
			return null;
		}

		return lock;
	}

	getAllLocks(): ContentLock[] {
		const now = Date.now();
		const locks: ContentLock[] = [];

		for (const [_path, lock] of this.locks.entries()) {
			if (lock.expiresAt > now) {
				locks.push(lock);
			} else {
				this.locks.delete(_path);
			}
		}

		return locks;
	}

	cleanupExpiredLocks(): void {
		const now = Date.now();

		for (const [_path, lock] of this.locks.entries()) {
			if (lock.expiresAt <= now) {
				this.locks.delete(_path);
			}
		}
	}

	forceReleaseLock(_path: string): UnlockResult {
		const lock = this.locks.get(_path);

		if (!lock) {
			return {
				success: false,
				error: "No lock found",
			};
		}

		this.locks.delete(_path);

		return {
			success: true,
		};
	}

	getStats() {
		return {
			totalLocks: this.locks.size,
			activeLocks: Array.from(this.locks.values()).filter((l) => l.expiresAt > Date.now()).length,
			timeout: this.__lockTimeout,
		};
	}
}

let lockInstance: ContentLockManager | null = null;

export function getContentLockManager(): ContentLockManager {
	if (!lockInstance) {
		lockInstance = new ContentLockManager();
	}
	return lockInstance;
}
