import { z } from "zod";
export const AddressSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  type: z.enum(["billing", "shipping", "both"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export const ShippingRateSchema = z.object({
  id: z.number(),
  zoneId: z.number(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  minWeight: z.number(),
  maxWeight: z.number(),
  freeShippingThreshold: z.number().optional()
});
export const ShippingZoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  countries: z.array(z.string()),
  rates: z.array(ShippingRateSchema),
  isActive: z.boolean()
});
export const DbAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string()
});
