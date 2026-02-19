let cachedRates = null;
const CACHE_DURATION = 60 * 60 * 1e3;
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET") {
    try {
      const now = /* @__PURE__ */ new Date();
      if (cachedRates && now.getTime() - new Date(cachedRates.lastUpdated).getTime() < CACHE_DURATION) {
        return cachedRates;
      }
      const rates = {
        THB: 1,
        USD: 0.028,
        EUR: 0.026,
        GBP: 0.022,
        JPY: 4.2,
        CNY: 0.2
      };
      cachedRates = { rates, lastUpdated: now.toISOString() };
      return cachedRates;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching exchange rates:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch exchange rates: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
