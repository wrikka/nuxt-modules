import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "POST") {
    return {
      command: {
        type: "search",
        value: "",
        confidence: 0.9,
      },
    }
  }

  return { error: "Not found" }
})
