import { z } from "zod";
export const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerId: z.string(),
  rating: z.number(),
  title: z.string().nullable(),
  content: z.string().nullable(),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.string(),
  // Dates are serialized as strings
  updatedAt: z.string(),
  customer: z.object({
    name: z.string().nullable()
  }),
  helpful: z.number().default(0),
  isVerified: z.boolean().default(false),
  userMarkedHelpful: z.boolean().optional()
});
export const ReviewStatsSchema = z.object({
  averageRating: z.number(),
  totalReviews: z.number(),
  ratingDistribution: z.object({
    "5": z.number(),
    "4": z.number(),
    "3": z.number(),
    "2": z.number(),
    "1": z.number()
  })
});
