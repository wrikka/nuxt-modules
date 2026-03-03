import type { ContentItem } from "../../../shared/types";

export interface ContentTemplate {
	id: string;
	name: string;
	description?: string;
	fields: TemplateField[];
	collection: string;
	createdAt: string;
	updatedAt: string;
}

export interface TemplateField {
	name: string;
	type: "string" | "number" | "boolean" | "date" | "array" | "object";
	required: boolean;
	defaultValue?: any;
	options?: string[];
	validation?: string;
}

export class ContentTemplates {
	private templates: Map<string, ContentTemplate> = new Map();

	createTemplate(
		name: string,
		collection: string,
		fields: TemplateField[],
		description?: string,
	): ContentTemplate {
		const id = crypto.randomUUID();
		const now = new Date().toISOString();

		const template: ContentTemplate = {
			id,
			name,
			description,
			fields,
			collection,
			createdAt: now,
			updatedAt: now,
		};

		this.templates.set(id, template);
		return template;
	}

	updateTemplate(
		id: string,
		updates: Partial<Pick<ContentTemplate, "name" | "description" | "fields">>,
	): ContentTemplate | null {
		const template = this.templates.get(id);
		if (!template) return null;

		const updated: ContentTemplate = {
			...template,
			...updates,
			updatedAt: new Date().toISOString(),
		};

		this.templates.set(id, updated);
		return updated;
	}

	deleteTemplate(id: string): boolean {
		return this.templates.delete(id);
	}

	getTemplate(id: string): ContentTemplate | null {
		return this.templates.get(id) || null;
	}

	getTemplatesByCollection(collection: string): ContentTemplate[] {
		return Array.from(this.templates.values()).filter((t) => t.collection === collection);
	}

	getAllTemplates(): ContentTemplate[] {
		return Array.from(this.templates.values());
	}

	applyTemplate(templateId: string, data: Record<string, any>): Record<string, any> {
		const template = this.templates.get(templateId);
		if (!template) {
			throw new Error(`Template not found: ${templateId}`);
		}

		const result: Record<string, any> = {};

		for (const field of template.fields) {
			const value = data[field.name];

			if (value === undefined || value === null) {
				if (field.required) {
					throw new Error(`Required field "${field.name}" is missing`);
				}
				result[field.name] = field.defaultValue;
			} else {
				result[field.name] = this.validateField(field, value);
			}
		}

		return result;
	}

	private validateField(field: TemplateField, value: any): any {
		switch (field.type) {
			case "string":
				if (typeof value !== "string") {
					throw new Error(`Field "${field.name}" must be a string`);
				}
				if (field.options && !field.options.includes(value)) {
					throw new Error(`Invalid value for field "${field.name}"`);
				}
				return value;

			case "number":
				if (typeof value !== "number") {
					throw new Error(`Field "${field.name}" must be a number`);
				}
				return value;

			case "boolean":
				if (typeof value !== "boolean") {
					throw new Error(`Field "${field.name}" must be a boolean`);
				}
				return value;

			case "date":
				if (!(value instanceof Date) && typeof value !== "string") {
					throw new Error(`Field "${field.name}" must be a date`);
				}
				return value;

			case "array":
				if (!Array.isArray(value)) {
					throw new Error(`Field "${field.name}" must be an array`);
				}
				return value;

			case "object":
				if (typeof value !== "object" || value === null) {
					throw new Error(`Field "${field.name}" must be an object`);
				}
				return value;

			default:
				return value;
		}
	}

	validateContent(templateId: string, content: ContentItem): boolean {
		const template = this.templates.get(templateId);
		if (!template) return false;

		for (const field of template.fields) {
			const value = content[field.name];
			if (value === undefined || value === null) {
				if (field.required) return false;
			} else {
				try {
					this.validateField(field, value);
				} catch {
					return false;
				}
			}
		}

		return true;
	}
}

// Singleton instance
let templatesInstance: ContentTemplates | null = null;

export function useContentTemplates(): ContentTemplates {
	if (!templatesInstance) {
		templatesInstance = new ContentTemplates();
	}
	return templatesInstance;
}

// Helper composable for templates
export function useTemplates() {
	const templates = useContentTemplates();

	return {
		createTemplate: (
			name: string,
			collection: string,
			fields: TemplateField[],
			description?: string,
		) => templates.createTemplate(name, collection, fields, description),
		updateTemplate: (
			id: string,
			updates: Partial<Pick<ContentTemplate, "name" | "description" | "fields">>,
		) => templates.updateTemplate(id, updates),
		deleteTemplate: (id: string) => templates.deleteTemplate(id),
		getTemplate: (id: string) => templates.getTemplate(id),
		getTemplatesByCollection: (collection: string) => templates.getTemplatesByCollection(collection),
		getAllTemplates: () => templates.getAllTemplates(),
		applyTemplate: (templateId: string, data: Record<string, any>) => templates.applyTemplate(templateId, data),
		validateContent: (templateId: string, content: ContentItem) => templates.validateContent(templateId, content),
	};
}
