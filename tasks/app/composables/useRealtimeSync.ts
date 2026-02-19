import type { User } from "../../shared/types/task"
import { computed, readonly, ref } from "vue"

export interface CursorPosition {
	x: number
	y: number
	userId: string
	user: User
	timestamp: number
}

export interface RealtimeTaskUpdate {
	taskId: string
	field: string
	value: unknown
	userId: string
	timestamp: number
}

export function useRealtimeSync() {
	const ws = ref<WebSocket | null>(null)
	const isConnected = ref(false)
	const cursors = ref<Map<string, CursorPosition>>(new Map())
	const activeUsers = ref<Map<string, User>>(new Map())
	const pendingUpdates = ref<RealtimeTaskUpdate[]>([])
	const reconnectAttempts = ref(0)
	const maxReconnectAttempts = 5

	function connect(workspaceId: string) {
		const wsUrl = `${useRuntimeConfig().public.wsUrl}/realtime/${workspaceId}`
		ws.value = new WebSocket(wsUrl)

		ws.value.onopen = () => {
			isConnected.value = true
			reconnectAttempts.value = 0
			flushPendingUpdates()
		}

		ws.value.onmessage = (event) => {
			const data = JSON.parse(event.data)
			handleMessage(data)
		}

		ws.value.onclose = () => {
			isConnected.value = false
			attemptReconnect(workspaceId)
		}

		ws.value.onerror = (error) => {
			console.error("WebSocket error:", error)
		}
	}

	function handleMessage(data: { type: string, payload: unknown }) {
		switch (data.type) {
			case "cursor":
				cursors.value.set((data.payload as CursorPosition).userId, data.payload as CursorPosition)
				break
			case "cursor_remove":
				cursors.value.delete((data.payload as { userId: string }).userId)
				break
			case "task_update":
				// Trigger reactive update for task
				break
			case "user_join":
				activeUsers.value.set((data.payload as User).name, data.payload as User)
				break
			case "user_leave":
				activeUsers.value.delete((data.payload as User).name)
				break
		}
	}

	function attemptReconnect(workspaceId: string) {
		if (reconnectAttempts.value < maxReconnectAttempts) {
			reconnectAttempts.value++
			setTimeout(() => connect(workspaceId), 1000 * reconnectAttempts.value)
		}
	}

	function sendCursorPosition(x: number, y: number, userId: string, user: User) {
		const update: CursorPosition = { x, y, userId, user, timestamp: Date.now() }
		sendMessage("cursor", update)
	}

	function sendTaskUpdate(taskId: string, field: string, value: unknown, userId: string) {
		const update: RealtimeTaskUpdate = { taskId, field, value, userId, timestamp: Date.now() }
		if (isConnected.value) {
			sendMessage("task_update", update)
		}
		else {
			pendingUpdates.value.push(update)
		}
	}

	function sendMessage(type: string, payload: unknown) {
		if (ws.value?.readyState === WebSocket.OPEN) {
			ws.value.send(JSON.stringify({ type, payload }))
		}
	}

	function flushPendingUpdates() {
		while (pendingUpdates.value.length > 0) {
			const update = pendingUpdates.value.shift()
			if (update) {
				sendMessage("task_update", update)
			}
		}
	}

	function disconnect() {
		ws.value?.close()
		ws.value = null
		isConnected.value = false
	}

	const cursorsList = computed(() => Array.from(cursors.value.values()))
	const activeUsersList = computed(() => Array.from(activeUsers.value.values()))

	return {
		isConnected: readonly(isConnected),
		cursors: cursorsList,
		activeUsers: activeUsersList,
		connect,
		disconnect,
		sendCursorPosition,
		sendTaskUpdate,
	}
}
