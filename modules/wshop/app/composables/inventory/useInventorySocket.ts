import type { Inventory, StockAlert, StockMovement } from "#shared/types"
import { io, type Socket } from "socket.io-client"
import { ref } from "vue"

export function useInventorySocket(
	inventory: Ref<Inventory[]>,
	stockMovements: Ref<StockMovement[]>,
	stockAlerts: Ref<StockAlert[]>,
) {
	const socket = ref<Socket | null>(null)

	const connect = () => {
		if (socket.value) socket.value.disconnect()

		socket.value = io("/inventory", { transports: ["websocket"] })

		socket.value.on("connect", () => console.log("Connected to inventory WebSocket"))

		socket.value.on("inventory_update", (data: Inventory) => {
			const index = inventory.value.findIndex(item => item.id === data.id)
			if (index !== -1) {
				inventory.value[index] = data
			} else {
				inventory.value.push(data)
			}
		})

		socket.value.on("stock_movement", (data: StockMovement) => {
			stockMovements.value.unshift(data)
		})

		socket.value.on("stock_alert", (data: StockAlert) => {
			stockAlerts.value.unshift(data)
		})

		socket.value.on("disconnect", () => console.log("Disconnected from inventory WebSocket"))
	}

	const disconnect = () => {
		if (socket.value) {
			socket.value.disconnect()
			socket.value = null
		}
	}

	return {
		connect,
		disconnect,
	}
}
