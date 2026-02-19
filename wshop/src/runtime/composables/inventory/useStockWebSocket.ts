import type { StockAdjustment, StockAlert, StockMovement, StockTransfer } from "#shared/types"
import { ref } from "vue"

export function useStockWebSocket(
	stockAlerts: any,
	stockMovements: any,
	stockTransfers: any,
	stockAdjustments: any,
) {
	const socket = ref<WebSocket | null>(null)

	const initializeWebSocket = () => {
		if (process.client) {
			socket.value = new WebSocket("ws://localhost:3001/stock")

			socket.value.onmessage = (event: MessageEvent) => {
				const data = JSON.parse(event.data)
				handleRealtimeUpdate(data)
			}

			socket.value.onopen = () => {
				console.log("Stock WebSocket connected")
			}

			socket.value.onerror = (error) => {
				console.error("Stock WebSocket error:", error)
			}

			socket.value.onclose = () => {
				console.log("Stock WebSocket disconnected")
				// Attempt to reconnect after 3 seconds
				setTimeout(initializeWebSocket, 3000)
			}
		}
	}

	const handleRealtimeUpdate = (
		data: { type: string; payload: StockAlert | StockMovement | StockTransfer | StockAdjustment },
	) => {
		switch (data.type) {
			case "stock_alert":
				stockAlerts.value.unshift(data.payload as StockAlert)
				break
			case "stock_movement":
				stockMovements.value.unshift(data.payload as StockMovement)
				break
			case "stock_transfer":
				const transferIndex = stockTransfers.value.findIndex((t: StockTransfer) =>
					t.id === data.payload.id
				)
				if (transferIndex !== -1) {
					stockTransfers.value[transferIndex] = data.payload as StockTransfer
				} else {
					stockTransfers.value.unshift(data.payload as StockTransfer)
				}
				break
			case "stock_adjustment":
				stockAdjustments.value.unshift(data.payload as StockAdjustment)
				break
		}
	}

	return {
		initializeWebSocket,
		socket,
	}
}
