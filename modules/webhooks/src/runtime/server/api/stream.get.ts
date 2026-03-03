import { defineEventHandler, setResponseHeaders } from 'h3';

export default defineEventHandler(event => {
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial connection message
      sendEvent({ type: 'connected', timestamp: new Date().toISOString() });

      // Keep-alive every 30 seconds
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 30000);

      // Store handler for webhook events
      event.context._webhookStream = sendEvent;

      // Cleanup on close
      event.node.req.on('close', () => {
        clearInterval(keepAlive);
        controller.close();
      });
    },
  });

  return stream;
});
