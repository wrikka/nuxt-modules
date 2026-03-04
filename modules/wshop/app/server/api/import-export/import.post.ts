import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "POST") {
    const body = await readBody(event)
    return {
      id: crypto.randomUUID(),
      fileName: body.file?.name || "import.csv",
      status: "processing",
      totalRows: 0,
      processedRows: 0,
      successRows: 0,
      failedRows: 0,
      errors: [],
      createdAt: new Date(),
    }
  }

  return { error: "Not found" }
})
