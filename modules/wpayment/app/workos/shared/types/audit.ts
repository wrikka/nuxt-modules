export interface AuditLog {
	id: string
	userId: string
	organizationId?: string
	action: string
	resource: string
	resourceId?: string
	details?: Record<string, unknown>
	ipAddress: string
	userAgent: string
	timestamp: string
	severity: "low" | "medium" | "high" | "critical"
	category: "auth" | "user" | "organization" | "system" | "security" | "compliance"
	success: boolean
	errorMessage?: string
}

export interface AuditLogFilter {
	userId?: string
	organizationId?: string
	action?: string
	resource?: string
	severity?: AuditLog["severity"]
	category?: AuditLog["category"]
	startDate?: string
	endDate?: string
	success?: boolean
	limit?: number
	offset?: number
}

export interface AuditLogExport {
	logs: AuditLog[]
	totalCount: number
	exportedAt: string
	exportedBy: string
	format: "json" | "csv" | "xlsx"
}
