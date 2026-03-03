import type { EmailTemplate } from "../shared/types/advanced"
import { generateId } from "../utils"

export const useWorkOSEmailTemplates = () => {
	const createEmailTemplate = async (
		template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">,
	): Promise<EmailTemplate> => {
		return await $fetch("/api/workos/email-templates", {
			method: "POST",
			body: {
				...template,
				id: generateId(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const getEmailTemplates = async (organizationId?: string): Promise<EmailTemplate[]> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch(`/api/workos/email-templates${query}`)
	}

	const sendTestEmail = async (templateId: string, testData: Record<string, unknown>): Promise<{
		success: boolean
		messageId?: string
	}> => {
		return await $fetch(`/api/workos/email-templates/${templateId}/test`, {
			method: "POST",
			body: testData,
		})
	}

	return {
		createEmailTemplate,
		getEmailTemplates,
		sendTestEmail,
	}
}
