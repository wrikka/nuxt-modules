import { createError, eventHandler, getQuery, readBody } from "h3";
import { getContentLockManager } from "../../../utils/locking";

export default eventHandler(async (event) => {
	const query = getQuery(event);
	const path = query.path as string;

	if (!path) {
		throw createError({
			statusCode: 400,
			message: "Missing path parameter",
		});
	}

	const body = await readBody(event);
	const { userId, userName, duration } = body;

	if (!userId || !userName) {
		throw createError({
			statusCode: 400,
			message: "Missing userId or userName",
		});
	}

	const lockManager = getContentLockManager();
	const result = lockManager.acquireLock(path, userId, userName, duration);

	return result;
});
