import { defineEventHandler, type H3Event, sendStream, setResponseHeaders, useRuntimeConfig } from 'h3';
import type { FlagEvent } from '#feature-flags/types';

let clients: Set<{ write: (data: string) => void; end: () => void; }> = new Set();

export function broadcastFlagEvent(event: FlagEvent) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of clients) {
    try {
      client.write(data);
    } catch {
      clients.delete(client);
    }
  }
}

export function getConnectedClientsCount() {
  return clients.size;
}

export default defineEventHandler((event: H3Event) => {
  const config = useRuntimeConfig();
  const realtimeEnabled = config.public.featureFlags?.realtime?.enabled ?? false;

  if (!realtimeEnabled) {
    return { error: 'Real-time updates disabled' };
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      const client = {
        write: (data: string) => {
          try {
            controller.enqueue(new TextEncoder().encode(data));
          } catch {
            // Client disconnected
          }
        },
        end: () => {
          try {
            controller.close();
          } catch {
            // Already closed
          }
        },
      };

      clients.add(client);

      // Send initial sync
      const syncEvent: FlagEvent = {
        type: 'flags:sync',
        timestamp: Date.now(),
        data: {
          flags: {},
        },
      };
      client.write(`data: ${JSON.stringify(syncEvent)}\n\n`);

      // Keep-alive ping
      const pingInterval = setInterval(() => {
        try {
          client.write(': ping\n\n');
        } catch {
          clearInterval(pingInterval);
          clients.delete(client);
        }
      }, 30000);

      // Cleanup on close
      event.node.req.on('close', () => {
        clearInterval(pingInterval);
        clients.delete(client);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return sendStream(event, stream);
});
