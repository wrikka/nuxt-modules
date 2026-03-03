import { db } from "../db"

export default defineEventHandler((_event) => {
	return db.tasks
})
