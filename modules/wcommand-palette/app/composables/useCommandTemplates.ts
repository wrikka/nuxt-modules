import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Command } from '../types'

export interface UseCommandTemplatesReturn {
	/** Available templates */
	templates: Ref<Command[]>
	/** Create template from command */
	createTemplate: (command: Command, templateName?: string) => Command
	/** Apply template */
	applyTemplate: (templateId: string, overrides?: Partial<Command>) => Command | null
	/** Delete template */
	deleteTemplate: (templateId: string) => void
	/** Get template by ID */
	getTemplate: (templateId: string) => Command | undefined
	/** Export template */
	exportTemplate: (templateId: string) => string
	/** Import template */
	importTemplate: (json: string) => Command | null
}

const STORAGE_KEY = 'palette-templates'
const templates = ref<Command[]>([])

export function useCommandTemplates(): UseCommandTemplatesReturn {
	const loadTemplates = () => {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				try {
					templates.value = JSON.parse(stored)
				} catch {
					templates.value = []
				}
			}
		}
	}

	const saveTemplates = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(templates.value))
		}
	}

	const createTemplate = (command: Command, templateName?: string): Command => {
		const template: Command = {
			...command,
			id: `template-${Date.now()}`,
			name: command.name,
			title: templateName || `${command.title} Template`,
			description: command.description || `Template based on ${command.title}`,
			keywords: [...(command.keywords || []), 'template'],
		}
		templates.value.push(template)
		saveTemplates()
		return template
	}

	const applyTemplate = (templateId: string, overrides?: Partial<Command>): Command | null => {
		const template = templates.value.find(t => t.id === templateId)
		if (!template) return null

		return {
			...template,
			id: `instance-${Date.now()}`,
			...overrides,
		}
	}

	const deleteTemplate = (templateId: string) => {
		const idx = templates.value.findIndex(t => t.id === templateId)
		if (idx > -1) {
			templates.value.splice(idx, 1)
			saveTemplates()
		}
	}

	const getTemplate = (templateId: string): Command | undefined => {
		return templates.value.find(t => t.id === templateId)
	}

	const exportTemplate = (templateId: string): string => {
		const template = getTemplate(templateId)
		if (!template) return ''
		return JSON.stringify(template, null, 2)
	}

	const importTemplate = (json: string): Command | null => {
		try {
			const template = JSON.parse(json) as Command
			template.id = `template-${Date.now()}`
			templates.value.push(template)
			saveTemplates()
			return template
		} catch {
			return null
		}
	}

	// Load on init
	loadTemplates()

	return {
		templates,
		createTemplate,
		applyTemplate,
		deleteTemplate,
		getTemplate,
		exportTemplate,
		importTemplate,
	}
}
