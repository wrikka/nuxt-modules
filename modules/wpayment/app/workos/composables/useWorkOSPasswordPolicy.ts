import type { PasswordPolicy } from "../shared/types/advanced"
import { generateId } from "../utils"

export const useWorkOSPasswordPolicy = () => {
	const createPasswordPolicy = async (
		policy: Omit<PasswordPolicy, "id" | "createdAt" | "updatedAt">,
	): Promise<PasswordPolicy> => {
		return await $fetch("/api/workos/password-policies", {
			method: "POST",
			body: {
				...policy,
				id: generateId(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const getPasswordPolicies = async (organizationId?: string): Promise<PasswordPolicy[]> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch(`/api/workos/password-policies${query}`)
	}

	return {
		createPasswordPolicy,
		getPasswordPolicies,
	}
}
