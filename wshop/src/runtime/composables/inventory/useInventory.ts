import type { Inventory, Product, StockAlert, StockMovement } from "#shared/types"
import { computed, onMounted, onUnmounted, type Ref, ref } from "vue"
import { useInventoryApi } from "./useInventoryApi"
import { useInventorySocket } from "./useInventorySocket"

export function useInventory() {
	const inventory = ref<Inventory[]>([])
	const products = ref<Product[]>([])
	const stockMovements = ref<StockMovement[]>([])
	const stockAlerts = ref<StockAlert[]>([])
	const loading = ref(false)
	const processing = ref(false)
	const error = ref<string | null>(null)

	const api = useInventoryApi()
	const socket = useInventorySocket(inventory, stockMovements, stockAlerts)

	const totalProducts = computed(() => inventory.value.length)
	const inStockCount = computed(() =>
		inventory.value.filter((item: Inventory) => item.availableQuantity > 10).length
	)
	const lowStockCount = computed(() =>
		inventory.value.filter((item: Inventory) =>
			item.availableQuantity > 0 && item.availableQuantity <= 10
		).length
	)
	const outOfStockCount = computed(() =>
		inventory.value.filter((item: Inventory) => item.availableQuantity === 0).length
	)
	const lowStockItems = computed(() =>
		inventory.value.filter((item: Inventory) =>
			item.availableQuantity <= item.reorderLevel && item.availableQuantity > 0
		)
	)
	const outOfStockItems = computed(() =>
		inventory.value.filter((item: Inventory) => item.availableQuantity === 0)
	)

	const loadData = async <T>(loader: () => Promise<T>, state: Ref<T>, errorMessage: string) => {
		try {
			state.value = await loader()
		} catch (err) {
			console.error(errorMessage, err)
		}
	}

	const loadAllData = async () => {
		loading.value = true
		error.value = null
		await Promise.all([
			loadData(api.fetchInventory, inventory, "Failed to load inventory"),
			loadData(api.fetchProducts, products, "Failed to load products"),
			loadData(api.fetchStockAlerts, stockAlerts, "Failed to load stock alerts"),
		])
		loading.value = false
	}

	const executeProcessingAction = async (action: () => Promise<void>, errorMessage: string) => {
		processing.value = true
		error.value = null
		try {
			await action()
		} catch (err) {
			error.value = err instanceof Error ? err.message : errorMessage
			throw err
		} finally {
			processing.value = false
		}
	}

	const adjustStock = async (
		adjustment: {
			productId: string
			type: "in" | "out" | "adjustment"
			quantity: number
			reason: string
		},
	) => {
		await executeProcessingAction(async () => {
			await api.adjustStock(adjustment)
			await loadAllData()
		}, "Failed to adjust stock")
	}

	const updateInventoryItem = async (id: number, updates: Partial<Inventory>) => {
		await executeProcessingAction(async () => {
			await api.updateInventoryItem(id, updates)
			await loadAllData()
		}, "Failed to update inventory")
	}

	const bulkUpdateInventory = async (
		updates: Array<{ id: number; updates: Partial<Inventory> }>,
	) => {
		await executeProcessingAction(async () => {
			await api.bulkUpdateInventory(updates)
			await loadAllData()
		}, "Failed to bulk update inventory")
	}

	onMounted(() => {
		loadAllData()
		socket.connect()
	})

	onUnmounted(() => {
		socket.disconnect()
	})

	return {
		inventory,
		products,
		stockMovements,
		stockAlerts,
		loading,
		processing,
		error,
		totalProducts,
		inStockCount,
		lowStockCount,
		outOfStockCount,
		lowStockItems,
		outOfStockItems,
		loadInventory: () => loadData(api.fetchInventory, inventory, "Failed to load inventory"),
		loadProducts: () => loadData(api.fetchProducts, products, "Failed to load products"),
		loadStockMovements: (productId?: number) =>
			loadData(
				() => api.fetchStockMovements(productId),
				stockMovements,
				"Failed to load stock movements",
			),
		loadStockAlerts: () =>
			loadData(api.fetchStockAlerts, stockAlerts, "Failed to load stock alerts"),
		adjustStock,
		updateInventoryItem,
		bulkUpdateInventory,
		exportInventory: api.exportInventory,
		markAlertAsRead: api.markAlertAsRead,
		dismissAlert: api.dismissAlert,
		subscribeToInventoryUpdates: () => {
			socket.connect()
			return socket.disconnect
		},
		getInventoryByProductId: (productId: string) =>
			inventory.value.find((item: Inventory) => item.productId === productId),
		getStockStatus: (productId: string) => {
			const item = inventory.value.find((item: Inventory) => item.productId === productId)
			if (!item) return "unknown"
			if (item.availableQuantity === 0) return "out_of_stock"
			if (item.availableQuantity <= item.reorderLevel) return "low_stock"
			return "in_stock"
		},
		calculateInventoryValue: () =>
			inventory.value.reduce((total: number, item: Inventory) => {
				const product = products.value.find((p: Product) => p.id === item.productId)
				return total + (item.quantity * parseFloat(product?.price || "0"))
			}, 0),
		getTopMovingProducts: (limit = 10) =>
			stockMovements.value
				.reduce(
					(
						acc: Array<{ productId: number; totalQuantity: number; movements: number }>,
						movement: StockMovement,
					) => {
						const productIdAsNumber = parseInt(movement.productId, 10)
						const existing = acc.find((item: { productId: number }) =>
							item.productId === productIdAsNumber
						)
						if (existing) {
							existing.totalQuantity += Math.abs(movement.quantity)
						} else {
							acc.push({
								productId: productIdAsNumber,
								totalQuantity: Math.abs(movement.quantity),
								movements: 1,
							})
						}
						return acc
					},
					[] as Array<{ productId: number; totalQuantity: number; movements: number }>,
				)
				.sort((a: { totalQuantity: number }, b: { totalQuantity: number }) =>
					b.totalQuantity - a.totalQuantity
				)
				.slice(0, limit),
	}
}
