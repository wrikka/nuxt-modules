export interface ModuleOptions {
	/**
	 * Site URL for the e-commerce platform
	 */
	siteUrl?: string

	/**
	 * Stripe Secret Key
	 */
	stripeSecretKey?: string

	/**
	 * Stripe Publishable Key
	 */
	stripePublishableKey?: string

	/**
	 * Database URL
	 */
	databaseUrl?: string

	/**
	 * Resend API Key for emails
	 */
	resendApiKey?: string

	/**
	 * From email for Resend
	 */
	resendFromEmail?: string

	/**
	 * Enable admin panel
	 * @default true
	 */
	enableAdmin?: boolean

	/**
	 * Admin panel path
	 * @default '/admin'
	 */
	adminPath?: string

	/**
	 * Enable customer accounts
	 * @default true
	 */
	enableCustomerAccounts?: boolean

	/**
	 * Enable product reviews
	 * @default true
	 */
	enableReviews?: boolean

	/**
	 * Enable wishlist functionality
	 * @default true
	 */
	enableWishlist?: boolean

	/**
	 * Enable inventory management
	 * @default true
	 */
	enableInventory?: boolean

	/**
	 * Enable discount codes
	 * @default true
	 */
	enableDiscounts?: boolean

	/**
	 * Enable shipping calculations
	 * @default true
	 */
	enableShipping?: boolean

	/**
	 * Enable tax calculations
	 * @default true
	 */
	enableTaxes?: boolean

	/**
	 * Component prefix
	 * @default 'WShop'
	 */
	componentPrefix?: string

	/**
	 * Enable e-commerce components
	 * @default true
	 */
	enableComponents?: boolean

	/**
	 * Supported locales
	 * @default ['en', 'th']
	 */
	locales?: string[]

	/**
	 * Default locale
	 * @default 'en'
	 */
	defaultLocale?: string

	/**
	 * Currency configuration
	 */
	currency?: {
		code: string
		symbol: string
		position: "before" | "after"
	}

	/**
	 * Image optimization settings
	 */
	image?: {
		formats: string[]
		sizes: Record<string, number>
	}
}

export interface WShopConfig {
	siteUrl: string
	stripeSecretKey: string
	stripePublishableKey: string
	databaseUrl: string
	resendApiKey: string
	resendFromEmail: string
	enableAdmin: boolean
	adminPath: string
	enableCustomerAccounts: boolean
	enableReviews: boolean
	enableWishlist: boolean
	enableInventory: boolean
	enableDiscounts: boolean
	enableShipping: boolean
	enableTaxes: boolean
	componentPrefix: string
	enableComponents: boolean
	locales: string[]
	defaultLocale: string
	currency: {
		code: string
		symbol: string
		position: "before" | "after"
	}
	image: {
		formats: string[]
		sizes: Record<string, number>
	}
}

export interface Product {
	id: string
	name: string
	description: string
	price: number
	compareAtPrice?: number
	sku: string
	images: string[]
	categories: string[]
	tags: string[]
	variants?: ProductVariant[]
	inventory: {
		quantity: number
		trackQuantity: boolean
		allowBackorder: boolean
	}
	seo?: {
		title?: string
		description?: string
	}
	status: "active" | "draft" | "archived"
	createdAt: Date
	updatedAt: Date
}

export interface ProductVariant {
	id: string
	productId: string
	name: string
	price: number
	sku: string
	options: Record<string, string>
	inventory: {
		quantity: number
		trackQuantity: boolean
		allowBackorder: boolean
	}
	image?: string
}

export interface Cart {
	id: string
	items: CartItem[]
	total: number
	subtotal: number
	tax: number
	shipping: number
	discount: number
	currency: string
}

export interface CartItem {
	id: string
	productId: string
	variantId?: string
	quantity: number
	price: number
	product: Product
	variant?: ProductVariant
}

export interface Order {
	id: string
	customerId: string
	items: OrderItem[]
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
	total: number
	subtotal: number
	tax: number
	shipping: number
	discount: number
	currency: string
	shippingAddress: Address
	billingAddress: Address
	paymentStatus: "pending" | "paid" | "failed" | "refunded"
	paymentIntentId?: string
	createdAt: Date
	updatedAt: Date
}

export interface OrderItem {
	id: string
	productId: string
	variantId?: string
	quantity: number
	price: number
	product: Product
	variant?: ProductVariant
}

export interface Customer {
	id: string
	email: string
	firstName: string
	lastName: string
	phone?: string
	addresses: Address[]
	createdAt: Date
	updatedAt: Date
}

export interface Address {
	id: string
	street: string
	city: string
	state: string
	postalCode: string
	country: string
	isDefault: boolean
	type: "shipping" | "billing"
}
