import Stripe from "stripe";
import { z } from "zod";
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string()
});
const lineItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  taxCode: z.string().optional()
});
const calculateTaxSchema = z.object({
  lineItems: z.array(lineItemSchema),
  shippingAddress: addressSchema,
  currency: z.string().default("thb"),
  customerId: z.string().optional()
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = calculateTaxSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
      data: validation.error.issues
    });
  }
  const { lineItems, shippingAddress, currency, customerId: _customerId } = validation.data;
  const config = useRuntimeConfig();
  if (!config.stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: "Stripe secret key is not configured." });
  }
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: "2025-12-15.clover" });
  try {
    const calculation = await stripe.tax.calculations.create({
      currency,
      customer_details: {
        address: {
          line1: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: shippingAddress.country
        },
        address_source: "shipping"
      },
      line_items: lineItems.map((item) => ({
        amount: Math.round(item.price * item.quantity * 100),
        // Amount in cents
        reference: item.id,
        // Your internal product or variant ID
        tax_code: item.taxCode || "txcd_99999999"
        // General tangible good
      }))
    });
    return {
      taxAmount: calculation.tax_amount_exclusive / 100,
      taxBreakdown: calculation.tax_breakdown
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Stripe Tax Calculation Error:", errorMessage);
    throw createError({ statusCode: 500, statusMessage: `Stripe API Error: ${errorMessage}` });
  }
});
