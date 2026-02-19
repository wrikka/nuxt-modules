export class PrintfulIntegration {
  async syncProduct(product, config) {
    console.log("Syncing product to Printful:", product);
    return { success: true, externalId: "pf_" + product.id };
  }
  async syncOrder(order, config) {
    console.log("Syncing order to Printful:", order);
    return { success: true };
  }
  async getProducts(config) {
    console.log("Getting products from Printful");
    return [];
  }
}
