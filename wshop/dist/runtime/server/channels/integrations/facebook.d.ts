export declare class FacebookIntegration {
    syncProduct(product: any, config: any): Promise<{
        success: boolean;
        externalId: string;
    }>;
    syncOrder(order: any, config: any): Promise<{
        success: boolean;
    }>;
    getOrders(config: any): Promise<never[]>;
}
//# sourceMappingURL=facebook.d.ts.map