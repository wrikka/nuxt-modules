import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "POST") {
    const body = await readBody(event)
    return {
      message: "",
      productSuggestions: [],
      quickReplies: [],
    }
  }

  return { error: "Not found" }
})
