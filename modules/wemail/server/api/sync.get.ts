// Real-time sync endpoint using Server-Sent Events
export default defineEventHandler((event) => {
  const { res } = event.node;

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write('data: {"type":"connected","timestamp":"' + new Date().toISOString() + '"}\n\n');

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat"}\n\n');
  }, 30000);

  // Cleanup on close
  res.on('close', () => {
    clearInterval(heartbeat);
  });

  // Return a promise that never resolves to keep the connection open
  return new Promise(() => {});
});
