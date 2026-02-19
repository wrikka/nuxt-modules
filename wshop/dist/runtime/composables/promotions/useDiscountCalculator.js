export function useDiscountCalculator() {
  const calculateDiscount = (promotion, cartTotal, cartItems) => {
    let discountAmount = 0;
    let applicable = true;
    let reason = "";
    const now = /* @__PURE__ */ new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    if (promotion.status !== "active" || now < startDate || now > endDate) {
      return {
        promotionId: promotion.id,
        promotionName: promotion.name,
        discountAmount: 0,
        applicable: false,
        reason: "\u0E42\u0E1B\u0E23\u0E42\u0E21\u0E0A\u0E31\u0E48\u0E19\u0E44\u0E21\u0E48\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"
      };
    }
    if (promotion.maxUsage && promotion.usageCount >= promotion.maxUsage) {
      return {
        promotionId: promotion.id,
        promotionName: promotion.name,
        discountAmount: 0,
        applicable: false,
        reason: "\u0E42\u0E1B\u0E23\u0E42\u0E21\u0E0A\u0E31\u0E48\u0E19\u0E16\u0E39\u0E01\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27"
      };
    }
    if (promotion.conditions?.minPurchase && cartTotal < promotion.conditions.minPurchase) {
      return {
        promotionId: promotion.id,
        promotionName: promotion.name,
        discountAmount: 0,
        applicable: false,
        reason: `\u0E22\u0E2D\u0E14\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E31\u0E49\u0E19\u0E15\u0E48\u0E33 \u0E3F${promotion.conditions.minPurchase}`
      };
    }
    if (promotion.conditions?.minQuantity && cartItems.length < promotion.conditions.minQuantity) {
      return {
        promotionId: promotion.id,
        promotionName: promotion.name,
        discountAmount: 0,
        applicable: false,
        reason: `\u0E08\u0E33\u0E19\u0E27\u0E19\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E02\u0E31\u0E49\u0E19\u0E15\u0E48\u0E33 ${promotion.conditions.minQuantity} \u0E0A\u0E34\u0E49\u0E19`
      };
    }
    switch (promotion.type) {
      case "percentage":
        discountAmount = cartTotal * (promotion.discountValue / 100);
        break;
      case "fixed":
        discountAmount = Math.min(promotion.discountValue, cartTotal);
        break;
      case "free_shipping":
        const shippingCost = cartTotal >= 500 ? 0 : 50;
        discountAmount = shippingCost;
        break;
      case "bundle":
        discountAmount = promotion.discountValue;
        break;
      case "buy_x_get_y":
        const requiredQuantity = promotion.conditions?.minQuantity || 2;
        if (cartItems.length >= requiredQuantity) {
          const cheapestItem = cartItems.reduce((min, item) => parseFloat(item.price) < parseFloat(min.price) ? item : min);
          discountAmount = parseFloat(cheapestItem.price);
        }
        break;
    }
    discountAmount = Math.min(discountAmount, cartTotal);
    return {
      promotionId: promotion.id,
      promotionName: promotion.name,
      discountAmount,
      applicable,
      reason
    };
  };
  const getBestDiscount = (cartTotal, cartItems, promotions) => {
    const discounts = promotions.map((promo) => calculateDiscount(promo, cartTotal, cartItems));
    const applicableDiscounts = discounts.filter((d) => d.applicable);
    if (applicableDiscounts.length === 0) {
      return {
        promotionId: 0,
        promotionName: "",
        discountAmount: 0,
        applicable: false,
        reason: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E42\u0E1B\u0E23\u0E42\u0E21\u0E0A\u0E31\u0E48\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E43\u0E0A\u0E49\u0E44\u0E14\u0E49"
      };
    }
    return applicableDiscounts.reduce((best, current) => current.discountAmount > best.discountAmount ? current : best);
  };
  return {
    calculateDiscount,
    getBestDiscount
  };
}
