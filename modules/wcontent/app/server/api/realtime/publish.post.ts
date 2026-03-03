import { createError, eventHandler, readBody } from "h3";
import { getRealtimeManager } from "../../../utils/realtime";

export default eventHandler(async (event) => {
	const body = await readBody(event);

	if (!body.type || !body.path) {
		throw createError({
			statusCode: 400,
			message: "Missing required fields: type, path",
		});
	}

	const realtime = getRealtimeManager();
	realtime.publish({
		...body,
		timestamp: Date.now(),
	});

	return { success: true };
});
