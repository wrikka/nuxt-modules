import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "GET") {
    return []
  }

  if (method === "POST") {
    const body = await readBody(event)
    return {
      id: crypto.randomUUID(),
      ...body,
      status: "waiting",
      createdAt: new Date(),
    }
  }

  return { error: "Not found" }
})
