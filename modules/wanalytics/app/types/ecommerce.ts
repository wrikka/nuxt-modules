import type { DateRange } from './common';

export interface EcommerceEvent {
  id?: string;
  type: EcommerceEventType;
  data: EcommerceEventData;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
  currency?: string;
}

export type EcommerceEventType =
  | 'view_item'
  | 'select_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'
  | 'refund'
  | 'view_item_list'
  | 'promo_clicked'
  | 'product_removed'
  | 'checkout_started'
  | 'shipping_added'
  | 'payment_info_added'
  | 'order_completed'
  | 'order_refunded'
  | 'promo_applied'
  | 'product_viewed'
  | 'product_list_viewed'
  | 'product_clicked'
  | 'product_added';

export interface EcommerceEventData {
  items: ProductItem[];
  value?: number;
  currency?: string;
  transactionId?: string;
  coupon?: string;
  shipping?: number;
  tax?: number;
  affiliation?: string;
  paymentType?: string;
  shippingTier?: string;
}

export interface ProductItem {
  itemId: string;
  itemName: string;
  itemCategory?: string;
  itemCategory2?: string;
  itemCategory3?: string;
  itemVariant?: string;
  itemBrand?: string;
  price: number;
  quantity: number;
  coupon?: string;
  discount?: number;
  index?: number;
  itemListId?: string;
  itemListName?: string;
}

export interface EcommerceAnalytics {
  period: DateRange;
  revenue: RevenueMetrics;
  products: ProductAnalytics[];
  categories: CategoryAnalytics[];
  funnels: EcommerceFunnel[];
  cart: CartAnalytics;
}

export interface RevenueMetrics {
  total: number;
  average: number;
  median: number;
  period?: DateRange;
  totalRevenue?: number;
  totalOrders?: number;
  averageOrderValue?: number;
  totalProductsSold?: number;
  totalCustomers?: number;
  newCustomers?: number;
  returningCustomers?: number;
  refundRate?: number;
  refundAmount?: number;
  byDay: DailyRevenue[];
  bySource: RevenueBySource[];
  growth: number;
  topProducts?: ProductPerformance[];
  topCategories?: CategoryPerformance[];
  revenueBySource?: RevenueBySource[];
  revenueByDay?: DailyRevenue[];
}

export interface DailyRevenue {
  date: Date;
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
}

export interface RevenueBySource {
  source: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface ProductAnalytics {
  itemId: string;
  itemName: string;
  views: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  quantity: number;
  avgPrice: number;
  conversionRate: number;
  position: number;
}

export interface CategoryAnalytics {
  category: string;
  views: number;
  revenue: number;
  products: number;
  avgPrice: number;
}

export interface EcommerceFunnel {
  step: string;
  visitors: number;
  dropOff: number;
  dropOffRate: number;
}

export interface CartAnalytics {
  created: number;
  abandoned: number;
  recovered: number;
  abandonmentRate: number;
  recoveryRate: number;
  avgValue: number;
  avgItems: number;
}

export interface EcommerceConfig {
  enabled: boolean;
  currency: string;
  trackProducts: boolean;
  trackCategories: boolean;
  trackCart: boolean;
  trackCheckout: boolean;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  price: number;
  brand?: string;
  variant?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  currency: string;
}

export interface OrderProduct {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  transactionId: string;
  revenue: number;
  tax: number;
  shipping: number;
  discount: number;
  coupon?: string;
  currency: string;
  products: OrderProduct[];
  customerId?: string;
  customerEmail?: string;
}

export interface ProductPerformance {
  productId: string;
  views: number;
  uniqueViews: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  quantity: number;
  conversionRate: number;
  cartRate: number;
  purchaseRate: number;
  avgPrice: number;
}

export interface CategoryPerformance {
  category: string;
  views: number;
  uniqueViews: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  quantity: number;
  conversionRate: number;
  products: Product[];
}
