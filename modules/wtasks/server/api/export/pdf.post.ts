import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	// Mock PDF generation - return URL to PDF
	return "/reports/tasks-export.pdf"
})
