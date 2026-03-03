import { useDb } from "../../utils/db";
import { successResponse } from "../../utils/error";

export default defineEventHandler(async () => {
	const db = useDb();

	const allFolders = await db.query.folders.findMany({
		orderBy: (folders, { asc }) => [asc(folders.order), asc(folders.name)],
	});

	return successResponse({
		data: allFolders,
	});
});
