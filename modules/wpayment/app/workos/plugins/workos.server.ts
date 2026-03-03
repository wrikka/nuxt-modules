import { defineNuxtPlugin } from "nuxt/app"
import { useWorkOS } from "../composables"

export default defineNuxtPlugin(() => {
	// Server-side WorkOS plugin initialization
	const { server } = useWorkOS()

	return {
		provide: {
			workosServer: server,
		},
	}
})
