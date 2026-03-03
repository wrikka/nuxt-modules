import { eventHandler, getQuery } from "h3";
import { getRealtimeManager } from "../../../utils/realtime";

export default eventHandler(async (event) => {
	const query = getQuery(event);
	const path = query.path as string;
	const limit = Number(query.limit) || 10;

	const realtime = getRealtimeManager();
	const history = realtime.getHistory(path, limit);

	return history;
});
