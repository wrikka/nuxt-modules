import { defineNuxtPlugin } from "nuxt/app"
import { useWorkOS } from "../composables"

export default defineNuxtPlugin(() => {
	// Client-side WorkOS plugin initialization
	const { client } = useWorkOS()

	return {
		provide: {
			workos: client,
		},
	}
})
