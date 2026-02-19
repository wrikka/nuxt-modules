// d:/wshop/app/composables/useAuth.ts

import { computed, useState } from "#imports"
import type { User } from "lucia"
import type { AuthError } from "./types"

const useUser = () => useState<User | null>("user", () => null)

export const useAuth = () => {
	const user = useUser()
	const loggedIn = computed(() => user.value !== null)

	const fetchUser = async () => {
		try {
			const data = await $fetch<{ user: User | null }>("/api/staff/auth/me")
			user.value = data.user
		} catch (error) {
			console.error("Failed to fetch user:", error)
			user.value = null
		}
	}

	const login = async (credentials: { email: string; password: string }) => {
		try {
			await $fetch("/api/staff/auth/login", {
				method: "POST",
				body: credentials,
			})
			await fetchUser() // Fetch user data after successful login
			return { success: true }
		} catch (error) {
			const authError = error as AuthError
			const message = authError.data?.message ?? "Login failed"
			return { success: false, message }
		}
	}

	const logout = async () => {
		try {
			await $fetch("/api/staff/auth/logout", { method: "POST" })
			user.value = null
			// Optionally, navigate to login page
			// await navigateTo('/admin/login');
		} catch (error) {
			console.error("Logout failed:", error)
		}
	}

	return {
		user,
		loggedIn,
		fetchUser,
		login,
		logout,
	}
}
