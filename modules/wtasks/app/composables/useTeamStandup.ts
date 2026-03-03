import type { Task } from "../../shared/types/task"
import { readonly, ref } from "vue"

export interface StandupReport {
	date: string
	userId: string
	completed: Task[]
	inProgress: Task[]
	blocked: Task[]
	planned: Task[]
}

export function useTeamStandup() {
	const reports = ref<StandupReport[]>([])
	const isGenerating = ref(false)

	function generateReport(userId: string, tasks: Task[]): StandupReport {
		const today = new Date().toISOString().split("T")[0]

		return {
			date: today,
			userId,
			completed: tasks.filter(t =>
				t.status === "Done" &&
				t.updatedAt.startsWith(today),
			),
			inProgress: tasks.filter(t =>
				t.status === "In Progress" &&
				t.assignee?.name === userId,
			),
			blocked: tasks.filter(t =>
				t.status === "In Review" ||
				(t.status === "In Progress" && t.priority === "Urgent"),
			),
			planned: tasks.filter(t =>
				t.status === "Backlog" &&
				t.assignee?.name === userId,
			),
		}
	}

	async function generateAIReport(userId: string, tasks: Task[]): Promise<string> {
		isGenerating.value = true
		try {
			const report = generateReport(userId, tasks)

			const response = await $fetch<{ summary: string }>("/api/ai/standup-report", {
				method: "POST",
				body: { report },
			})

			return response.summary
		}
		finally {
			isGenerating.value = false
		}
	}

	function formatReportAsMarkdown(report: StandupReport): string {
		let md = `## Standup Report - ${report.date}\n\n`

		if (report.completed.length > 0) {
			md += `**Yesterday I completed:**\n`
			report.completed.forEach(t => {
				md += `- ✅ ${t.title}\n`
			})
			md += "\n"
		}

		if (report.inProgress.length > 0) {
			md += `**Today I'm working on:**\n`
			report.inProgress.forEach(t => {
				md += `- 🔄 ${t.title}\n`
			})
			md += "\n"
		}

		if (report.blocked.length > 0) {
			md += `**Blocked by:**\n`
			report.blocked.forEach(t => {
				md += `- 🚫 ${t.title}\n`
			})
			md += "\n"
		}

		return md
	}

	function shareToSlack(report: StandupReport, webhookUrl: string): void {
		const text = formatReportAsMarkdown(report)
		fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		})
	}

	return {
		reports: readonly(reports),
		isGenerating: readonly(isGenerating),
		generateReport,
		generateAIReport,
		formatReportAsMarkdown,
		shareToSlack,
	}
}
