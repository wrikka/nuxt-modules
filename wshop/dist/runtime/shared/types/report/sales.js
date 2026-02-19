import { z } from "zod";
export const ProductSalesSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  quantity: z.number(),
  revenue: z.number(),
  growth: z.number()
});
export const CustomerSalesSchema = z.object({
  customerId: z.number(),
  customerName: z.string(),
  email: z.string().email(),
  totalSpent: z.number(),
  orderCount: z.number(),
  averageOrderValue: z.number()
});
export const CategorySalesSchema = z.object({
  categoryId: z.number(),
  categoryName: z.string(),
  revenue: z.number(),
  percentage: z.number()
});
export const DailySalesSchema = z.object({
  date: z.string(),
  revenue: z.number(),
  orders: z.number(),
  customers: z.number()
});
export const SalesReportSchema = z.object({
  period: z.string(),
  totalRevenue: z.number(),
  totalOrders: z.number(),
  averageOrderValue: z.number(),
  topProducts: z.array(ProductSalesSchema),
  topCustomers: z.array(CustomerSalesSchema),
  salesByCategory: z.array(CategorySalesSchema),
  salesByDay: z.array(DailySalesSchema)
});
