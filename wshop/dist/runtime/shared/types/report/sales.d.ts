import { z } from "zod";
export declare const ProductSalesSchema: z.ZodObject<{
    productId: z.ZodNumber;
    productName: z.ZodString;
    quantity: z.ZodNumber;
    revenue: z.ZodNumber;
    growth: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productId: number;
    quantity: number;
    productName: string;
    revenue: number;
    growth: number;
}, {
    productId: number;
    quantity: number;
    productName: string;
    revenue: number;
    growth: number;
}>;
export type ProductSales = z.infer<typeof ProductSalesSchema>;
export declare const CustomerSalesSchema: z.ZodObject<{
    customerId: z.ZodNumber;
    customerName: z.ZodString;
    email: z.ZodString;
    totalSpent: z.ZodNumber;
    orderCount: z.ZodNumber;
    averageOrderValue: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    email: string;
    orderCount: number;
    customerId: number;
    totalSpent: number;
    customerName: string;
    averageOrderValue: number;
}, {
    email: string;
    orderCount: number;
    customerId: number;
    totalSpent: number;
    customerName: string;
    averageOrderValue: number;
}>;
export type CustomerSales = z.infer<typeof CustomerSalesSchema>;
export declare const CategorySalesSchema: z.ZodObject<{
    categoryId: z.ZodNumber;
    categoryName: z.ZodString;
    revenue: z.ZodNumber;
    percentage: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    percentage: number;
    categoryId: number;
    revenue: number;
    categoryName: string;
}, {
    percentage: number;
    categoryId: number;
    revenue: number;
    categoryName: string;
}>;
export type CategorySales = z.infer<typeof CategorySalesSchema>;
export declare const DailySalesSchema: z.ZodObject<{
    date: z.ZodString;
    revenue: z.ZodNumber;
    orders: z.ZodNumber;
    customers: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    customers: number;
    date: string;
    orders: number;
    revenue: number;
}, {
    customers: number;
    date: string;
    orders: number;
    revenue: number;
}>;
export type DailySales = z.infer<typeof DailySalesSchema>;
export declare const SalesReportSchema: z.ZodObject<{
    period: z.ZodString;
    totalRevenue: z.ZodNumber;
    totalOrders: z.ZodNumber;
    averageOrderValue: z.ZodNumber;
    topProducts: z.ZodArray<z.ZodObject<{
        productId: z.ZodNumber;
        productName: z.ZodString;
        quantity: z.ZodNumber;
        revenue: z.ZodNumber;
        growth: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: number;
        quantity: number;
        productName: string;
        revenue: number;
        growth: number;
    }, {
        productId: number;
        quantity: number;
        productName: string;
        revenue: number;
        growth: number;
    }>, "many">;
    topCustomers: z.ZodArray<z.ZodObject<{
        customerId: z.ZodNumber;
        customerName: z.ZodString;
        email: z.ZodString;
        totalSpent: z.ZodNumber;
        orderCount: z.ZodNumber;
        averageOrderValue: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        email: string;
        orderCount: number;
        customerId: number;
        totalSpent: number;
        customerName: string;
        averageOrderValue: number;
    }, {
        email: string;
        orderCount: number;
        customerId: number;
        totalSpent: number;
        customerName: string;
        averageOrderValue: number;
    }>, "many">;
    salesByCategory: z.ZodArray<z.ZodObject<{
        categoryId: z.ZodNumber;
        categoryName: z.ZodString;
        revenue: z.ZodNumber;
        percentage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        percentage: number;
        categoryId: number;
        revenue: number;
        categoryName: string;
    }, {
        percentage: number;
        categoryId: number;
        revenue: number;
        categoryName: string;
    }>, "many">;
    salesByDay: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        revenue: z.ZodNumber;
        orders: z.ZodNumber;
        customers: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        customers: number;
        date: string;
        orders: number;
        revenue: number;
    }, {
        customers: number;
        date: string;
        orders: number;
        revenue: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    period: string;
    averageOrderValue: number;
    totalRevenue: number;
    totalOrders: number;
    topProducts: {
        productId: number;
        quantity: number;
        productName: string;
        revenue: number;
        growth: number;
    }[];
    topCustomers: {
        email: string;
        orderCount: number;
        customerId: number;
        totalSpent: number;
        customerName: string;
        averageOrderValue: number;
    }[];
    salesByCategory: {
        percentage: number;
        categoryId: number;
        revenue: number;
        categoryName: string;
    }[];
    salesByDay: {
        customers: number;
        date: string;
        orders: number;
        revenue: number;
    }[];
}, {
    period: string;
    averageOrderValue: number;
    totalRevenue: number;
    totalOrders: number;
    topProducts: {
        productId: number;
        quantity: number;
        productName: string;
        revenue: number;
        growth: number;
    }[];
    topCustomers: {
        email: string;
        orderCount: number;
        customerId: number;
        totalSpent: number;
        customerName: string;
        averageOrderValue: number;
    }[];
    salesByCategory: {
        percentage: number;
        categoryId: number;
        revenue: number;
        categoryName: string;
    }[];
    salesByDay: {
        customers: number;
        date: string;
        orders: number;
        revenue: number;
    }[];
}>;
export type SalesReport = z.infer<typeof SalesReportSchema>;
//# sourceMappingURL=sales.d.ts.map