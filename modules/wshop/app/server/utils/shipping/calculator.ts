// d:/wshop/server/utils/shipping/calculator.ts

import type { CartItem } from "~/shared/types"
import type { DbAddress } from "../../db/types"

export interface ShippingOption {
	id: string
	name: string
	description: string
	price: number
}

export interface ShippingCalculator {
	/**
	 * Calculates available shipping options and their costs.
	 * @param items The items in the cart.
	 * @param destination The shipping address.
	 */
	getShippingOptions(items: CartItem[], destination: DbAddress): Promise<ShippingOption[]>
}
