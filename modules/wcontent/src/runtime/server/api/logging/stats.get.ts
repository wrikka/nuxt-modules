import { defineEventHandler } from "h3";
import { getLogger } from "../../utils/services/logging";

export default defineEventHandler(() => {
	const logger = getLogger();
	return logger.getStats();
});
