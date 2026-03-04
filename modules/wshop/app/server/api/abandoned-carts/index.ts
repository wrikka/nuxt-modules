import { defineEventHandler, readBody, getQuery } from "h3"

// Abandoned Cart API
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET /api/shop/abandoned-carts/check
  if (method === "GET" && event.path.includes("/check")) {
    return []
  }

  // POST /api/shop/abandoned-carts
  if (method === "POST" && !event.path.includes("/recover") && !event.path.includes("/remind")) {
    const body = await readBody(event)
    return {
      id: crypto.randomUUID(),
      cartId: body.cartId,
      abandonedAt: new Date(),
      remindersSent: 0,
    }
  }

  // POST /api/shop/abandoned-carts/:id/recover
  if (method === "POST" && event.path.includes("/recover")) {
    const body = await readBody(event)
    return {
      id: crypto.randomUUID(),
      recoveredAt: new Date(),
      recoveryMethod: body.recoveryMethod,
    }
  }

  // POST /api/shop/abandoned-carts/:id/remind
  if (method === "POST" && event.path.includes("/remind")) {
    const body = await readBody(event)
    return {
      id: crypto.randomUUID(),
      remindersSent: 1,
    }
  }

  // GET /api/shop/abandoned-carts/stats
  if (method === "GET" && event.path.includes("/stats")) {
    const query = getQuery(event)
    return {
      recovered: 10,
      total: 50,
    }
  }

  return { error: "Not found" }
})
