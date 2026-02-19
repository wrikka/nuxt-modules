import { lucia } from "~~/server/utils/auth";
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName);
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    appendHeader(event, "Set-Cookie", sessionCookie.serialize());
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    appendHeader(event, "Set-Cookie", sessionCookie.serialize());
  }
  event.context.session = session;
  event.context.user = user;
  const protectedApiRoutes = [
    "/api/products",
    "/api/orders",
    "/api/customers",
    "/api/analytics",
    "/api/discounts",
    "/api/pages",
    "/api/staff",
    "/api/inventory",
    "/api/pos",
    "/api/posts"
  ];
  const isProtected = protectedApiRoutes.some((route) => event.path.startsWith(route));
  if (isProtected) {
    if (event.path.startsWith("/api/staff/auth")) {
      return;
    }
    if (!event.context.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized"
      });
    }
  }
});
