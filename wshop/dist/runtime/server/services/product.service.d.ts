export declare const getProductById: (id: string) => Promise<any>;
export declare const getProducts: () => Promise<any>;
export declare const createProduct: (data: any) => Promise<{
    status: "draft" | "active" | "archived";
    id: string;
    name: string;
    description: string | null;
    type: "physical" | "digital" | "service";
    createdAt: Date;
    updatedAt: Date;
    price: string;
    handle: string;
    taxCode: string | null;
} | undefined>;
export declare const updateProduct: (id: string, data: any) => Promise<{
    id: string;
    name: string;
    description: string | null;
    handle: string;
    price: string;
    status: "draft" | "active" | "archived";
    type: "physical" | "digital" | "service";
    taxCode: string | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined>;
export declare const deleteProduct: (id: string) => Promise<void>;
//# sourceMappingURL=product.service.d.ts.map