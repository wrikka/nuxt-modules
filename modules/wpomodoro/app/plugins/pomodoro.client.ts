import { defineNuxtPlugin } from "nuxt/app"
import { useSettings } from "../composables/useSettings"

export default defineNuxtPlugin(() => {
	const settings = useSettings()

	settings.loadSettings()

	if (typeof document !== "undefined") {
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				console.log("[Pomodoro] Tab hidden - timer continues in background")
			}
		})
	}

	return {
		provide: {
			pomodoro: {
				initialized: true,
				version: "0.0.1",
			},
		},
	}
})
