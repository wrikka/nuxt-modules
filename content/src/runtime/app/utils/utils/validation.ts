import { z } from "zod";
import type { ContentItem } from "../../../shared/types";

export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
}

export interface ValidationError {
	_path: string;
	field: string;
	message: string;
}

export interface ValidationWarning {
	_path: string;
	field: string;
	message: string;
}

export class ContentValidator {
	private schemas: Map<string, z.ZodSchema> = new Map();

	registerSchema(collection: string, schema: z.ZodSchema) {
		this.schemas.set(collection, schema);
	}

	validate(item: ContentItem, collection: string): ValidationResult {
		const schema = this.schemas.get(collection);

		if (!schema) {
			return {
				valid: true,
				errors: [],
				warnings: [],
			};
		}

		const result = schema.safeParse(item);

		if (result.success) {
			return {
				valid: true,
				errors: [],
				warnings: this.generateWarnings(item),
			};
		}

		return {
			valid: false,
			errors: result.error.issues.map((error: any) => ({
				_path: item.__path,
				field: error._path.join("."),
				message: error.message,
			})),
			warnings: this.generateWarnings(item),
		};
	}

	validateAll(items: ContentItem[], collection: string): ValidationResult[] {
		return items.map((item) => this.validate(item, collection));
	}

	private generateWarnings(item: ContentItem): ValidationWarning[] {
		const warnings: ValidationWarning[] = [];

		// Check for missing recommended fields
		if (!item.title) {
			warnings.push({
				_path: item.__path,
				field: "title",
				message: "Missing title field",
			});
		}

		if (!item.description) {
			warnings.push({
				_path: item.__path,
				field: "description",
				message: "Missing description field",
			});
		}

		if (!item.tags || item.tags.length === 0) {
			warnings.push({
				_path: item.__path,
				field: "tags",
				message: "No tags specified",
			});
		}

		// Check for deprecated fields
		if (item._partial) {
			warnings.push({
				_path: item.__path,
				field: "_partial",
				message: "Partial content should be used sparingly",
			});
		}

		return warnings;
	}

	fixCommonIssues(item: ContentItem): ContentItem {
		const fixed = { ...item };

		// Auto-generate slug if missing
		if (!fixed.slug && fixed.title) {
			fixed.slug = this.slugify(fixed.title);
		}

		// Auto-generate excerpt if missing
		if (!fixed.excerpt && fixed.body?.content) {
			fixed.excerpt = this.generateExcerpt(fixed.body.content);
		}

		// Auto-generate reading time if missing
		if (!fixed.readingTime && fixed.body?.content) {
			fixed.readingTime = this.calculateReadingTime(fixed.body.content);
		}

		return fixed;
	}

	private slugify(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/--+/g, "-")
			.trim();
	}

	private generateExcerpt(content: string, maxLength = 150): string {
		const text = content.replace(/[#*`]/g, "").trim();
		return text.slice(0, maxLength) + "...";
	}

	private calculateReadingTime(content: string): number {
		const words = content.split(/\s+/).length;
		return Math.ceil(words / 200); // Average reading speed: 200 words/minute
	}
}

let validatorInstance: ContentValidator | null = null;

export function getValidator(): ContentValidator {
	if (!validatorInstance) {
		validatorInstance = new ContentValidator();
	}
	return validatorInstance;
}
