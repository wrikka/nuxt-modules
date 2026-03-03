import { eventHandler, getQuery, setHeader } from "h3";
import { getRealtimeManager } from "../../../utils/realtime";

export default eventHandler(async (event) => {
	const query = getQuery(event);
	const path = query.path as string || "*";

	// Set headers for SSE
	setHeader(event, "Content-Type", "text/event-stream");
	setHeader(event, "Cache-Control", "no-cache");
	setHeader(event, "Connection", "keep-alive");
	setHeader(event, "X-Accel-Buffering", "no");

	const realtime = getRealtimeManager();
	const history = realtime.getHistory(path, 10);

	// Send history first
	for (const item of history) {
		await sendSSE(event, item);
	}

	// Subscribe to new events
	const subscription = realtime.subscribe(path, async (eventItem) => {
		await sendSSE(event, eventItem);
	});

	// Cleanup on disconnect
	event.node.req.on("close", () => {
		subscription.unsubscribe();
	});
});

async function sendSSE(event: any, data: any) {
	const message = `data: ${JSON.stringify(data)}\n\n`;
	await event.node.res.write(message);
}
