import { db } from "~~/server/db";
import { paymentMethods } from "~~/server/db/schemas";
export async function seedPaymentMethods() {
  const methods = [
    {
      id: "cash",
      name: "\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14",
      type: "cash",
      icon: "dollar-sign",
      enabled: true
    },
    {
      id: "card",
      name: "\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15/\u0E40\u0E14\u0E1A\u0E34\u0E15",
      type: "card",
      icon: "credit-card",
      enabled: true,
      config: {
        provider: "stripe",
        merchantId: "merchant_123"
      }
    },
    {
      id: "promptpay",
      name: "PromptPay",
      type: "qr",
      icon: "smartphone",
      enabled: true,
      config: {
        provider: "promptpay",
        merchantId: "merchant_123"
      }
    },
    {
      id: "truewallet",
      name: "TrueMoney Wallet",
      type: "qr",
      icon: "smartphone",
      enabled: true,
      config: {
        provider: "truewallet",
        merchantId: "merchant_123"
      }
    },
    {
      id: "linepay",
      name: "LINE Pay",
      type: "qr",
      icon: "smartphone",
      enabled: true,
      config: {
        provider: "linepay",
        merchantId: "merchant_123"
      }
    },
    {
      id: "transfer",
      name: "\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19\u0E1C\u0E48\u0E32\u0E19\u0E18\u0E19\u0E32\u0E04\u0E32\u0E23",
      type: "transfer",
      icon: "wallet",
      enabled: true
    }
  ];
  for (const method of methods) {
    await db.insert(paymentMethods).values(method).onConflictDoNothing();
  }
  console.log("\u2713 Payment methods seeded successfully");
}
