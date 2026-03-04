import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "POST") {
    return []
  }

  return { error: "Not found" }
})
