import { readonly, ref } from "vue"

export function useMermaidDiagram() {
	const isSupported = ref(true)
	const renderError = ref<string | null>(null)

	function extractMermaidBlocks(content: string): Array<{ id: string, code: string }> {
		const blocks: Array<{ id: string, code: string }> = []
		const regex = /```mermaid\n([\s\S]*?)```/g
		let match
		let index = 0

		while ((match = regex.exec(content)) !== null) {
			blocks.push({
				id: `mermaid-${index++}`,
				code: match[1].trim(),
			})
		}

		return blocks
	}

	async function renderDiagram(code: string, containerId: string): Promise<boolean> {
		try {
			// In a real implementation, this would use mermaid.js
			// For now, return true to indicate the structure is ready
			renderError.value = null
			return true
		}
		catch (e) {
			renderError.value = e instanceof Error ? e.message : "Failed to render diagram"
			return false
		}
	}

	function validateSyntax(code: string): { valid: boolean, error?: string } {
		// Basic validation for common diagram types
		const supportedTypes = [
			"flowchart", "graph TD", "graph LR", "graph BT", "graph RL",
			"sequenceDiagram", "classDiagram", "stateDiagram", "erDiagram",
			"gantt", "pie", "gitGraph", "mindmap", "timeline",
		]

		const firstLine = code.trim().split("\n")[0].toLowerCase()
		const hasValidType = supportedTypes.some(type =>
			firstLine.includes(type.toLowerCase()),
		)

		if (!hasValidType) {
			return { valid: false, error: "Unknown diagram type" }
		}

		return { valid: true }
	}

	function getDiagramType(code: string): string {
		const firstLine = code.trim().split("\n")[0].toLowerCase()
		if (firstLine.includes("flowchart") || firstLine.includes("graph")) return "flowchart"
		if (firstLine.includes("sequence")) return "sequence"
		if (firstLine.includes("class")) return "class"
		if (firstLine.includes("state")) return "state"
		if (firstLine.includes("er")) return "er"
		if (firstLine.includes("gantt")) return "gantt"
		if (firstLine.includes("pie")) return "pie"
		if (firstLine.includes("git")) return "git"
		return "unknown"
	}

	return {
		isSupported: readonly(isSupported),
		renderError: readonly(renderError),
		extractMermaidBlocks,
		renderDiagram,
		validateSyntax,
		getDiagramType,
	}
}
