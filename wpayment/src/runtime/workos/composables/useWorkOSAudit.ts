import type { AuditLog, AuditLogExport, AuditLogFilter } from "../shared/types/audit"

export const useWorkOSAudit = () => {
	const logAction = async (data: {
		action: string
		resource: string
		resourceId?: string
		details?: Record<string, unknown>
		severity?: AuditLog["severity"]
		category?: AuditLog["category"]
		success?: boolean
		errorMessage?: string
	}): Promise<void> => {
		try {
			const session = await $fetch<{ userId: string; organizationId: string }>(
				"/api/workos/sessions/current",
			)

			const auditLog: Omit<AuditLog, "id" | "timestamp" | "ipAddress" | "userAgent"> = {
				userId: session.userId,
				organizationId: session.organizationId,
				action: data.action,
				resource: data.resource,
				resourceId: data.resourceId,
				details: data.details,
				severity: data.severity || "medium",
				category: data.category || "system",
				success: data.success ?? true,
				errorMessage: data.errorMessage,
			}

			await $fetch("/api/workos/audit/logs", {
				method: "POST",
				body: auditLog,
			})
		} catch (error) {
			console.error("Failed to log audit action:", error)
		}
	}

	const getAuditLogs = async (filter: AuditLogFilter = {}): Promise<{
		logs: AuditLog[]
		totalCount: number
	}> => {
		const queryParams = new URLSearchParams()

		Object.entries(filter).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				queryParams.append(key, String(value))
			}
		})

		return await $fetch(`/api/workos/audit/logs?${queryParams.toString()}`)
	}

	const getAuditLog = async (id: string): Promise<AuditLog> => {
		return await $fetch(`/api/workos/audit/logs/${id}`)
	}

	const exportAuditLogs = async (
		filter: AuditLogFilter & {
			format: "json" | "csv" | "xlsx"
		},
	): Promise<AuditLogExport> => {
		const queryParams = new URLSearchParams()

		Object.entries(filter).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				queryParams.append(key, String(value))
			}
		})

		return await $fetch(`/api/workos/audit/export?${queryParams.toString()}`)
	}

	const searchAuditLogs = async (
		query: string,
		filter?: Partial<AuditLogFilter>,
	): Promise<AuditLog[]> => {
		return await $fetch("/api/workos/audit/search", {
			method: "POST",
			body: {
				query,
				filter,
			},
		})
	}

	const getAuditStatistics = async (filter?: Partial<AuditLogFilter>): Promise<{
		totalLogs: number
		logsByCategory: Record<string, number>
		logsBySeverity: Record<string, number>
		logsByAction: Record<string, number>
		recentActivity: AuditLog[]
		trendData: Array<{
			date: string
			count: number
		}>
	}> => {
		const queryParams = new URLSearchParams()

		if (filter) {
			Object.entries(filter).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					queryParams.append(key, String(value))
				}
			})
		}

		return await $fetch(`/api/workos/audit/statistics?${queryParams.toString()}`)
	}

	const deleteAuditLogs = async (filter: AuditLogFilter): Promise<{
		deletedCount: number
	}> => {
		return await $fetch("/api/workos/audit/logs/delete", {
			method: "POST",
			body: filter,
		})
	}

	const archiveAuditLogs = async (filter: AuditLogFilter): Promise<{
		archivedCount: number
		archiveId: string
	}> => {
		return await $fetch("/api/workos/audit/archive", {
			method: "POST",
			body: filter,
		})
	}

	const getAuditArchives = async (): Promise<
		Array<{
			id: string
			name: string
			createdAt: string
			logCount: number
			size: number
			format: string
		}>
	> => {
		return await $fetch("/api/workos/audit/archives")
	}

	const restoreAuditLogs = async (archiveId: string): Promise<{
		restoredCount: number
	}> => {
		return await $fetch(`/api/workos/audit/archives/${archiveId}/restore`, {
			method: "POST",
		})
	}

	const createAuditReport = async (
		filter: AuditLogFilter & {
			reportType: "summary" | "detailed" | "compliance"
			format: "pdf" | "html"
		},
	): Promise<{
		reportId: string
		downloadUrl: string
	}> => {
		return await $fetch("/api/workos/audit/reports", {
			method: "POST",
			body: filter,
		})
	}

	const getAuditReports = async (): Promise<
		Array<{
			id: string
			name: string
			type: string
			format: string
			createdAt: string
			size: number
			downloadUrl: string
		}>
	> => {
		return await $fetch("/api/workos/audit/reports")
	}

	return {
		logAction,
		getAuditLogs,
		getAuditLog,
		exportAuditLogs,
		searchAuditLogs,
		getAuditStatistics,
		deleteAuditLogs,
		archiveAuditLogs,
		getAuditArchives,
		restoreAuditLogs,
		createAuditReport,
		getAuditReports,
	}
}
