import type { ComplianceReport } from "../shared/types/advanced"
import { generateId } from "../utils"

export const useWorkOSCompliance = () => {
	const generateComplianceReport = async (config: {
		type: ComplianceReport["type"]
		organizationId?: string
		dateRange?: {
			startDate: string
			endDate: string
		}
	}): Promise<ComplianceReport> => {
		return await $fetch("/api/workos/compliance-reports", {
			method: "POST",
			body: {
				...config,
				id: generateId(),
				status: "pending",
				createdAt: new Date().toISOString(),
			},
		})
	}

	const getComplianceReports = async (organizationId?: string): Promise<ComplianceReport[]> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch(`/api/workos/compliance-reports${query}`)
	}

	return {
		generateComplianceReport,
		getComplianceReports,
	}
}
