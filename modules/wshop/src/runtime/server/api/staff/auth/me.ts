// d:/wshop/server/api/staff/auth/me.ts

export default defineEventHandler((event) => {
	// The auth middleware runs before this and attaches user to the context
	if (!event.context.user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		})
	}

	return {
		user: event.context.user,
	}
})
