import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "POST") {
    const body = await readBody(event)
    return {
      id: crypto.randomUUID(),
      ...body,
      status: "pending",
    }
  }

  return { error: "Not found" }
})
