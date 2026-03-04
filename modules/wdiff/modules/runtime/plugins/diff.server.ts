import { defineNitroPlugin } from "nitropack/runtime";

export default defineNitroPlugin((_nitroApp) => {
	// Server-side diff plugin
	// Add any server-side initialization here
	console.log("[Diff Module] Server plugin initialized");
});
