// Outlook OAuth callback handler
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { code, error } = query;

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Outlook auth error: ${error}`,
    });
  }

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing authorization code',
    });
  }

  // In production, this would:
  // 1. Exchange code for access token
  // 2. Get user info from Microsoft Graph
  // 3. Create/update account
  // 4. Redirect back to app

  // Mock success
  return sendRedirect(event, '/settings/accounts?success=outlook');
});
