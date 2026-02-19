export class FacebookIntegration {
  async syncProduct(product, config) {
    console.log("Syncing product to Facebook:", product);
    return { success: true, externalId: "fb_" + product.id };
  }
  async syncOrder(order, config) {
    console.log("Syncing order from Facebook:", order);
    return { success: true };
  }
  async getOrders(config) {
    console.log("Getting orders from Facebook");
    return [];
  }
}
