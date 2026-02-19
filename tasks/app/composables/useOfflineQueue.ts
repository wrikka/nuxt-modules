import { computed, readonly, ref } from "vue"

export interface QueuedOperation {
	id: string
	type: "create" | "update" | "delete"
	entity: string
	data: unknown
	timestamp: number
	retryCount: number
}

export function useOfflineQueue() {
	const queue = ref<QueuedOperation[]>([])
	const isOnline = ref(navigator.onLine)
	const isSyncing = ref(false)
	const lastSync = ref<number | null>(null)

	const STORAGE_KEY = "tasks-offline-queue"

	function loadQueue(): void {
		if (typeof localStorage !== "undefined") {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				queue.value = JSON.parse(stored)
			}
		}
	}

	function saveQueue(): void {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.value))
		}
	}

	function enqueue(operation: Omit<QueuedOperation, "id" | "timestamp" | "retryCount">): string {
		const id = crypto.randomUUID()
		const queuedOp: QueuedOperation = {
			...operation,
			id,
			timestamp: Date.now(),
			retryCount: 0,
		}
		queue.value.push(queuedOp)
		saveQueue()
		return id
	}

	function dequeue(id: string): void {
		queue.value = queue.value.filter(op => op.id !== id)
		saveQueue()
	}

	async function sync(): Promise<void> {
		if (!isOnline.value || queue.value.length === 0) return

		isSyncing.value = true
		const failed: QueuedOperation[] = []

		for (const operation of [...queue.value]) {
			try {
				await executeOperation(operation)
				dequeue(operation.id)
			}
			catch (e) {
				if (operation.retryCount < 3) {
					operation.retryCount++
					failed.push(operation)
				}
			}
		}

		queue.value = failed
		saveQueue()
		lastSync.value = Date.now()
		isSyncing.value = false
	}

	async function executeOperation(op: QueuedOperation): Promise<void> {
		switch (op.type) {
			case "create":
				await $fetch(`/api/${op.entity}`, {
					method: "POST",
					body: op.data,
				})
				break
			case "update":
				await $fetch(`/api/${op.entity}/${(op.data as { id: string }).id}`, {
					method: "PATCH",
					body: op.data,
				})
				break
			case "delete":
				await $fetch(`/api/${op.entity}/${op.data}`, {
					method: "DELETE",
				})
				break
		}
	}

	function updateOnlineStatus(): void {
		isOnline.value = navigator.onLine
		if (isOnline.value) {
			sync()
		}
	}

	if (typeof window !== "undefined") {
		window.addEventListener("online", updateOnlineStatus)
		window.addEventListener("offline", updateOnlineStatus)
		loadQueue()
	}

	const pendingCount = computed(() => queue.value.length)

	return {
		queue: readonly(queue),
		isOnline: readonly(isOnline),
		isSyncing: readonly(isSyncing),
		pendingCount,
		lastSync: readonly(lastSync),
		enqueue,
		sync,
	}
}
