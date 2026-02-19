import { computed, ref } from 'vue';
import type {
  Cart,
  CategoryPerformance,
  EcommerceConfig,
  EcommerceEvent,
  EcommerceEventType,
  Order,
  Product,
  ProductPerformance,
  RevenueMetrics,
} from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useEcommerce = () => {
  const ecommerceConfig = useAnalyticsConfig().ecommerce as EcommerceConfig;

  const cart = ref<Cart | null>(null);
  const lastOrder = ref<Order | null>(null);
  const events = ref<EcommerceEvent[]>([]);
  const isLoading = ref(false);

  const isEnabled = computed(() => ecommerceConfig.enabled);

  const trackEvent = (type: EcommerceEventType, data: Record<string, unknown>): EcommerceEvent | null => {
    if (!isEnabled.value) return null;

    const event: EcommerceEvent = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date(),
      data: { items: [], ...data },
    };

    events.value.push(event);
    return event;
  };

  const viewProduct = (product: Product): EcommerceEvent | null => {
    return trackEvent('product_viewed', {
      product,
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
    });
  };

  const viewProductList = (products: Product[], listName: string): EcommerceEvent | null => {
    return trackEvent('product_list_viewed', {
      products,
      listName,
      productCount: products.length,
    });
  };

  const clickProduct = (product: Product, listName?: string): EcommerceEvent | null => {
    return trackEvent('product_clicked', {
      product,
      productId: product.id,
      productName: product.name,
      listName,
    });
  };

  const addToCart = (product: Product, quantity: number = 1): EcommerceEvent | null => {
    if (!cart.value) {
      cart.value = {
        id: crypto.randomUUID(),
        items: [],
        total: 0,
        currency: ecommerceConfig.currency,
      };
    }

    const existingItem = cart.value.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.product.price;
    } else {
      cart.value.items.push({
        product,
        quantity,
        total: quantity * product.price,
      });
    }

    cart.value.total = cart.value.items.reduce((sum, item) => sum + item.total, 0);

    return trackEvent('product_added', {
      product,
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      quantity,
      cartTotal: cart.value.total,
      cartItemCount: cart.value.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  };

  const removeFromCart = (product: Product, quantity?: number): EcommerceEvent | null => {
    if (!cart.value) return null;

    const itemIndex = cart.value.items.findIndex(item => item.product.id === product.id);
    if (itemIndex === -1) return null;

    const item = cart.value.items[itemIndex];
    const removedQuantity = quantity ?? item.quantity;

    if (!quantity || quantity >= item.quantity) {
      cart.value.items.splice(itemIndex, 1);
    } else {
      item.quantity -= quantity;
      item.total = item.quantity * item.product.price;
    }

    cart.value.total = cart.value.items.reduce((sum, i) => sum + i.total, 0);

    return trackEvent('product_removed', {
      product,
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: removedQuantity,
      cartTotal: cart.value.total,
    });
  };

  const beginCheckout = (): EcommerceEvent | null => {
    if (!cart.value || cart.value.items.length === 0) return null;

    return trackEvent('checkout_started', {
      cart: cart.value,
      products: cart.value.items.map(item => item.product),
      value: cart.value.total,
      itemCount: cart.value.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  };

  const addShipping = (shippingMethod: string, shippingCost: number): EcommerceEvent | null => {
    return trackEvent('shipping_added', {
      shippingMethod,
      shippingCost,
      currency: ecommerceConfig.currency,
    });
  };

  const addPayment = (paymentMethod: string): EcommerceEvent | null => {
    return trackEvent('payment_info_added', {
      paymentMethod,
    });
  };

  const purchase = (order: Partial<Order>): EcommerceEvent | null => {
    if (!cart.value) return null;

    const completeOrder: Order = {
      id: order.id ?? crypto.randomUUID(),
      transactionId: order.transactionId ?? crypto.randomUUID(),
      revenue: cart.value.total,
      tax: order.tax ?? 0,
      shipping: order.shipping ?? 0,
      discount: order.discount ?? 0,
      coupon: order.coupon,
      currency: ecommerceConfig.currency,
      products: cart.value.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      customerId: order.customerId,
      customerEmail: order.customerEmail,
    };

    lastOrder.value = completeOrder;

    const event = trackEvent('order_completed', {
      order: completeOrder,
      orderId: completeOrder.id,
      transactionId: completeOrder.transactionId,
      revenue: completeOrder.revenue,
      tax: completeOrder.tax,
      shipping: completeOrder.shipping,
      discount: completeOrder.discount,
      coupon: completeOrder.coupon,
      products: completeOrder.products,
      productCount: completeOrder.products.reduce((sum, p) => sum + p.quantity, 0),
    });

    // Clear cart after purchase
    cart.value = null;

    return event;
  };

  const refund = (orderId: string, products?: Product[]): EcommerceEvent | null => {
    return trackEvent('order_refunded', {
      orderId,
      products,
      fullRefund: !products,
    });
  };

  const addPromo = (promoCode: string, discount: number): EcommerceEvent | null => {
    return trackEvent('promo_applied', {
      promoCode,
      discount,
      currency: ecommerceConfig.currency,
    });
  };

  const getRevenueMetrics = async (period: { start: Date; end: Date; }): Promise<RevenueMetrics> => {
    // Mock data for demo
    return {
      total: 25000,
      average: 166.67,
      median: 150,
      period,
      totalRevenue: 25000,
      totalOrders: 150,
      averageOrderValue: 166.67,
      totalProductsSold: 450,
      totalCustomers: 120,
      newCustomers: 45,
      returningCustomers: 75,
      refundRate: 2.5,
      refundAmount: 625,
      byDay: [],
      bySource: [],
      growth: 15,
      topProducts: [],
      topCategories: [],
      revenueBySource: [],
      revenueByDay: [],
    };
  };

  const getProductPerformance = async (productId: string): Promise<ProductPerformance | null> => {
    // Mock data
    return {
      productId,
      views: 1500,
      uniqueViews: 1200,
      addToCarts: 150,
      purchases: 85,
      revenue: 4250,
      quantity: 85,
      conversionRate: 5.67,
      cartRate: 10,
      purchaseRate: 5.67,
      avgPrice: 50,
    };
  };

  const getCategoryPerformance = async (category: string): Promise<CategoryPerformance | null> => {
    // Mock data
    return {
      category,
      views: 5000,
      uniqueViews: 3500,
      addToCarts: 350,
      purchases: 200,
      revenue: 10000,
      quantity: 200,
      conversionRate: 4,
      products: [],
    };
  };

  return {
    cart,
    lastOrder,
    events,
    isLoading,
    isEnabled,
    trackEvent,
    viewProduct,
    viewProductList,
    clickProduct,
    addToCart,
    removeFromCart,
    beginCheckout,
    addShipping,
    addPayment,
    purchase,
    refund,
    addPromo,
    getRevenueMetrics,
    getProductPerformance,
    getCategoryPerformance,
  };
};
