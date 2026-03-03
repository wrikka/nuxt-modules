import { createError, eventHandler, getQuery } from "h3";
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

	const lockManager = getContentLockManager();
	const lock = lockManager.getLock(path);

	return lock;
});
