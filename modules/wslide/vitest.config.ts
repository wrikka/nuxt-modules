import { defineVitestConfig } from "../../packages/config/vitest/config";

export default defineVitestConfig({
	test: {
		name: "wslide",
		globals: true,
		environment: "happy-dom",
	},
});
