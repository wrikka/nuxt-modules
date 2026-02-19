import { createError, eventHandler, readBody } from "h3";
import { getContentLockManager } from "../../../utils/locking";

export default eventHandler(async (event) => {
	const body = await readBody(event);
	const { path, userId } = body;

	if (!path || !userId) {
		throw createError({
			statusCode: 400,
			message: "Missing path or userId",
		});
	}

	const lockManager = getContentLockManager();
	const result = lockManager.releaseLock(path, userId);

	return result;
});
