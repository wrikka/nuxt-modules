import type { ContentValidationOptions, ValidationResult, ValidationRule } from "../../../shared/types/validation";

export class ContentValidator {
	private rules: ValidationRule[] = [];

	addRule(rule: ValidationRule): void {
		this.rules.push(rule);
	}

	async validate(content: string, options: ContentValidationOptions = {}): Promise<ValidationResult> {
		const errors: any[] = [];
		const warnings: any[] = [];

		if (options.minLength && content.length < options.minLength) {
			errors.push({
				field: "content",
				message: `Content must be at least ${options.minLength} characters`,
				code: "MIN_LENGTH",
			});
		}

		if (options.maxLength && content.length > options.maxLength) {
			errors.push({
				field: "content",
				message: `Content must not exceed ${options.maxLength} characters`,
				code: "MAX_LENGTH",
			});
		}

		if (options.checkMarkdown) {
			const markdownErrors = this.validateMarkdown(content);
			errors.push(...markdownErrors);
		}

		if (options.checkLinks) {
			const linkErrors = this.validateLinks(content);
			warnings.push(...linkErrors);
		}

		if (options.checkImages) {
			const imageErrors = this.validateImages(content);
			warnings.push(...imageErrors);
		}

		for (const rule of this.rules) {
			try {
				const isValid = await rule.validate(content);
				if (!isValid) {
					errors.push({
						field: rule.field,
						message: rule.message,
						code: rule.code,
					});
				}
			} catch (error) {
				errors.push({
					field: rule.field,
					message: `Validation error: ${String(error)}`,
					code: "VALIDATION_ERROR",
				});
			}
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings,
		};
	}

	private validateMarkdown(content: string): any[] {
		const errors: any[] = [];

		const headingRegex = /^(#{1,6}\s.+)$/gm;
		const headings = content.match(headingRegex) || [];

		for (let i = 0; i < headings.length - 1; i++) {
			const currentLevel = headings[i].match(/^#+/)?.[0].length || 0;
			const nextLevel = headings[i + 1].match(/^#+/)?.[0].length || 0;

			if (nextLevel > currentLevel + 1) {
				errors.push({
					field: "markdown",
					message: `Heading level jumps from ${currentLevel} to ${nextLevel}`,
					code: "HEADING_LEVEL_JUMP",
				});
			}
		}

		return errors;
	}

	private validateLinks(content: string): any[] {
		const warnings: any[] = [];
		const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
		const links = content.match(linkRegex) || [];

		for (const link of links) {
			const urlMatch = link.match(/\(([^)]+)\)/);
			if (urlMatch) {
				const url = urlMatch[1];
				if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
					warnings.push({
						field: "links",
						message: `Link "${url}" may be broken`,
						code: "POSSIBLE_BROKEN_LINK",
					});
				}
			}
		}

		return warnings;
	}

	private validateImages(content: string): any[] {
		const warnings: any[] = [];
		const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
		const images = content.match(imageRegex) || [];

		for (const image of images) {
			const altMatch = image.match(/!\[([^\]]*)\]/);
			if (altMatch && !altMatch[1]) {
				warnings.push({
					field: "images",
					message: "Image missing alt text",
					code: "MISSING_ALT_TEXT",
				});
			}
		}

		return warnings;
	}
}

let instance: ContentValidator | null = null;

export function getContentValidator(): ContentValidator {
	if (!instance) {
		instance = new ContentValidator();
	}
	return instance;
}
