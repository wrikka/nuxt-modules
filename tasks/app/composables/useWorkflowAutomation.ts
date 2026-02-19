import type { AutomationRule } from "~/shared/types/features"

/**
 * Composable for Workflow Automation
 */
export const useWorkflowAutomation = () => {
	const rules = useState<AutomationRule[]>("automation-rules", () => [])
	const isRuleBuilderOpen = useState<boolean>("rule-builder-open", () => false)
	const editingRule = useState<AutomationRule | null>("editing-rule", () => null)

	/**
	 * Fetch automation rules
	 */
	const fetchRules = async () => {
		const { data } = await useFetch<AutomationRule[]>("/api/automation/rules")
		if (data.value) rules.value = data.value
	}

	/**
	 * Create new rule
	 */
	const createRule = async (ruleData: Omit<AutomationRule, "id">) => {
		const { data, error } = await useFetch<AutomationRule>("/api/automation/rules", {
			method: "POST",
			body: ruleData,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to create rule")
			return null
		}

		rules.value.push(data.value)
		$toast.success("Automation rule created")
		return data.value
	}

	/**
	 * Update rule
	 */
	const updateRule = async (ruleId: string, updates: Partial<AutomationRule>) => {
		const { data, error } = await useFetch<AutomationRule>(`/api/automation/rules/${ruleId}`, {
			method: "PATCH",
			body: updates,
		})

		if (error.value || !data.value) {
			$toast.error("Failed to update rule")
			return false
		}

		const index = rules.value.findIndex(r => r.id === ruleId)
		if (index !== -1) rules.value[index] = data.value
		return true
	}

	/**
	 * Delete rule
	 */
	const deleteRule = async (ruleId: string) => {
		const { error } = await useFetch(`/api/automation/rules/${ruleId}`, { method: "DELETE" })

		if (error.value) {
			$toast.error("Failed to delete rule")
			return false
		}

		rules.value = rules.value.filter(r => r.id !== ruleId)
		$toast.success("Rule deleted")
		return true
	}

	/**
	 * Toggle rule enabled status
	 */
	const toggleRule = async (ruleId: string) => {
		const rule = rules.value.find(r => r.id === ruleId)
		if (!rule) return false

		return await updateRule(ruleId, { enabled: !rule.enabled })
	}

	/**
	 * Open rule builder
	 */
	const openRuleBuilder = (rule?: AutomationRule) => {
		editingRule.value = rule || null
		isRuleBuilderOpen.value = true
	}

	/**
	 * Close rule builder
	 */
	const closeRuleBuilder = () => {
		isRuleBuilderOpen.value = false
		editingRule.value = null
	}

	/**
	 * Get trigger type label
	 */
	const getTriggerLabel = (type: AutomationRule["trigger"]["type"]): string => {
		const labels: Record<string, string> = {
			status_change: "Status Changes",
			task_created: "Task Created",
			due_date_approaching: "Due Date Approaching",
			assigned: "Task Assigned",
			custom_field_changed: "Custom Field Changed",
		}
		return labels[type] || type
	}

	/**
	 * Get action type label
	 */
	const getActionLabel = (type: AutomationRule["actions"][0]["type"]): string => {
		const labels: Record<string, string> = {
			change_status: "Change Status",
			assign_user: "Assign User",
			add_tag: "Add Tag",
			send_notification: "Send Notification",
			create_subtask: "Create Subtask",
			webhook: "Call Webhook",
		}
		return labels[type] || type
	}

	return {
		rules: readonly(rules),
		isRuleBuilderOpen,
		editingRule,
		fetchRules,
		createRule,
		updateRule,
		deleteRule,
		toggleRule,
		openRuleBuilder,
		closeRuleBuilder,
		getTriggerLabel,
		getActionLabel,
	}
}
