export interface DbAddress {
	street?: string
	city?: string
	state?: string
	zip?: string
	country?: string
}

export interface DbCustomer {
	id: string
	email: string
	firstName?: string
	lastName?: string
	phone?: string
}

export interface DbProduct {
	id: string
	name: string
	description?: string
	price: string
	status: string
	createdAt: Date
	updatedAt: Date
}

export interface DbOrder {
	id: string
	customerId?: string
	status: string
	paymentStatus: string
	total: string
	subtotal: string
	taxAmount: string
	shippingCost: string
	createdAt: Date
	updatedAt: Date
}
