export default defineEventHandler(async (event) => {
	// Add CORS headers for development
	const url = getRequestURL(event)

	// Skip CORS for same-origin requests
	if (url.protocol === "http:" || url.protocol === "https:") {
		setHeader(event, "Access-Control-Allow-Origin", "*")
		setHeader(event, "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		setHeader(event, "Access-Control-Allow-Headers", "Content-Type, Authorization")
	}

	// Handle preflight requests
	if (getMethod(event) === "OPTIONS") {
		event.node.res.writeHead(200)
		event.node.res.end()
		return
	}

	// Add security headers
	setHeader(event, "X-Content-Type-Options", "nosniff")
	setHeader(event, "X-Frame-Options", "DENY")
	setHeader(event, "X-XSS-Protection", "1; mode=block")
	setHeader(event, "Referrer-Policy", "strict-origin-when-cross-origin")
})
