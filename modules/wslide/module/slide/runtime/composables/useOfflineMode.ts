import { ref, computed, onMounted } from "vue";

export interface CachedSlide {
	id: string;
	content: string;
	cachedAt: Date;
	expiresAt: Date;
}

export function useOfflineMode() {
	const isOnline = ref(true);
	const cachedSlides = ref<CachedSlide[]>([]);
	const isSyncing = ref(false);
	const pendingChanges = ref<string[]>([]);

	const CACHE_KEY = "wslide:offline-cache";
	const PENDING_KEY = "wslide:pending-changes";

	const canWorkOffline = computed(() => cachedSlides.value.length > 0);
	const hasPendingChanges = computed(() => pendingChanges.value.length > 0);
	const cacheSize = computed(() => {
		const data = localStorage.getItem(CACHE_KEY) || "";
		return new Blob([data]).size;
	});

	function init() {
		if (typeof window === "undefined") return;
		
		isOnline.value = navigator.onLine;
		loadCache();
		loadPendingChanges();
		
		window.addEventListener("online", () => {
			isOnline.value = true;
			syncChanges();
		});
		
		window.addEventListener("offline", () => {
			isOnline.value = false;
		});
	}

	function loadCache() {
		try {
			const stored = localStorage.getItem(CACHE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				cachedSlides.value = parsed.map((s: CachedSlide) => ({
					...s,
					cachedAt: new Date(s.cachedAt),
					expiresAt: new Date(s.expiresAt),
				}));
			}
		} catch {
			cachedSlides.value = [];
		}
	}

	function loadPendingChanges() {
		try {
			const stored = localStorage.getItem(PENDING_KEY);
			if (stored) {
				pendingChanges.value = JSON.parse(stored);
			}
		} catch {
			pendingChanges.value = [];
		}
	}

	function cacheSlide(id: string, content: string, ttlHours = 24) {
		const cachedAt = new Date();
		const expiresAt = new Date(cachedAt.getTime() + ttlHours * 60 * 60 * 1000);
		
		const existing = cachedSlides.value.find(s => s.id === id);
		if (existing) {
			existing.content = content;
			existing.cachedAt = cachedAt;
			existing.expiresAt = expiresAt;
		} else {
			cachedSlides.value.push({ id, content, cachedAt, expiresAt });
		}
		
		persistCache();
	}

	function persistCache() {
		localStorage.setItem(CACHE_KEY, JSON.stringify(cachedSlides.value));
	}

	function getCachedSlide(id: string): CachedSlide | null {
		const slide = cachedSlides.value.find(s => s.id === id);
		if (slide && new Date() < new Date(slide.expiresAt)) {
			return slide;
		}
		return null;
	}

	function queueChange(change: string) {
		if (!isOnline.value) {
			pendingChanges.value.push(change);
			localStorage.setItem(PENDING_KEY, JSON.stringify(pendingChanges.value));
		}
	}

	async function syncChanges() {
		if (!isOnline.value || pendingChanges.value.length === 0) return;
		
		isSyncing.value = true;
		
		try {
			// Send pending changes to server
			for (const change of pendingChanges.value) {
				await fetch("/api/wslide/sync", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: change,
				});
			}
			
			pendingChanges.value = [];
			localStorage.removeItem(PENDING_KEY);
		} finally {
			isSyncing.value = false;
		}
	}

	function clearCache() {
		cachedSlides.value = [];
		localStorage.removeItem(CACHE_KEY);
	}

	function clearPendingChanges() {
		pendingChanges.value = [];
		localStorage.removeItem(PENDING_KEY);
	}

	onMounted(() => {
		init();
	});

	return {
		isOnline: readonly(isOnline),
		cachedSlides: readonly(cachedSlides),
		isSyncing: readonly(isSyncing),
		pendingChanges: readonly(pendingChanges),
		canWorkOffline,
		hasPendingChanges,
		cacheSize,
		cacheSlide,
		getCachedSlide,
		queueChange,
		syncChanges,
		clearCache,
		clearPendingChanges,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
