import { emails } from '../../db/emails';

interface TrackEvent {
  emailId: number;
  recipient: string;
  event: 'read' | 'click' | 'bounce';
  timestamp: string;
  userAgent?: string;
}

const trackingEvents: TrackEvent[] = [];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { emailId, recipient, event: eventType, timestamp, userAgent } = body;

  if (!emailId || !recipient || !eventType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: emailId, recipient, event',
    });
  }

  const trackEvent: TrackEvent = {
    emailId,
    recipient,
    event: eventType,
    timestamp: timestamp || new Date().toISOString(),
    userAgent: userAgent || getHeader(event, 'user-agent'),
  };

  trackingEvents.push(trackEvent);

  // Update email read status if it's a read event
  if (eventType === 'read') {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      email.read = true;
    }
  }

  return {
    success: true,
    tracked: trackEvent,
  };
});

// Get tracking events for an email
export const getTrackingEvents = (emailId: number): TrackEvent[] => {
  return trackingEvents.filter(e => e.emailId === emailId);
};
