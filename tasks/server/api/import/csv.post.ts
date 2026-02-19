import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	// Mock CSV import
	return {
		success: 5,
		failed: 0,
		errors: [],
	}
})
