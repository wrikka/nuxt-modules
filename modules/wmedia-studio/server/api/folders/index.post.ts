import { nanoid } from "nanoid";
import { folders } from "../../db/schema";
import { CreateFolderSchema } from "../../schemas/folder.schema";
import { useDb } from "../../utils/db";
import { successResponse } from "../../utils/error";
import { validateBody } from "../../utils/validation";

export default defineEventHandler(async (event) => {
	const body = await validateBody(event, CreateFolderSchema);
	const db = useDb();
	const now = new Date();

	const folder = {
		id: nanoid(),
		name: body.name,
		parentId: body.parentId,
		order: body.order,
		createdAt: now,
		updatedAt: now,
	};

	await db.insert(folders).values(folder);

	return successResponse({
		folder,
	});
});
