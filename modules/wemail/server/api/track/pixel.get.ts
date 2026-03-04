// Tracking pixel endpoint - returns 1x1 transparent GIF and records the read event
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { id } = query;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email ID',
    });
  }

  // Record the read event
  const userAgent = getHeader(event, 'user-agent');
  const ip = getRequestIP(event) || 'unknown';

  // In a real implementation, this would:
  // 1. Record the read event in the database
  // 2. Update the email's read status
  // 3. Trigger any notifications

  console.log(`Email ${id} read from IP ${ip} with User-Agent: ${userAgent}`);

  // Return 1x1 transparent GIF
  const transparentGif = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  setHeader(event, 'Content-Type', 'image/gif');
  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate');
  setHeader(event, 'Pragma', 'no-cache');
  setHeader(event, 'Expires', '0');

  return transparentGif;
});
