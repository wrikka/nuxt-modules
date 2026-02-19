export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (url.protocol === "http:" || url.protocol === "https:") {
    setHeader(event, "Access-Control-Allow-Origin", "*");
    setHeader(event, "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    setHeader(event, "Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (getMethod(event) === "OPTIONS") {
    event.node.res.writeHead(200);
    event.node.res.end();
    return;
  }
  setHeader(event, "X-Content-Type-Options", "nosniff");
  setHeader(event, "X-Frame-Options", "DENY");
  setHeader(event, "X-XSS-Protection", "1; mode=block");
  setHeader(event, "Referrer-Policy", "strict-origin-when-cross-origin");
});
