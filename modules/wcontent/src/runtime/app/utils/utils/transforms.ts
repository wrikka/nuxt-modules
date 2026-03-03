import type { ContentItem } from "../../../shared/types";

export interface TransformOptions {
	slugify?: boolean;
	formatDate?: boolean;
	normalizeTags?: boolean;
	trimWhitespace?: boolean;
}

export class ContentTransformer {
	transform(item: ContentItem, options: TransformOptions = {}): ContentItem {
		let transformed = { ...item };

		if (options.slugify) {
			transformed.slug = this.slugify(item.title || "");
		}

		if (options.formatDate) {
			transformed.date = this.formatDate(item.date);
		}

		if (options.normalizeTags) {
			transformed.tags = this.normalizeTags(item.tags);
		}

		if (options.trimWhitespace) {
			transformed = this.trimWhitespace(transformed as any);
		}

		return transformed;
	}

	transformMany(items: ContentItem[], options: TransformOptions = {}): ContentItem[] {
		return items.map((item) => this.transform(item, options));
	}

	private slugify(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/--+/g, "-")
			.trim();
	}

	private formatDate(date: string | undefined): string | undefined {
		if (!date) return undefined;

		try {
			const parsed = new Date(date);
			return parsed.toISOString();
		} catch {
			return date;
		}
	}

	private normalizeTags(tags: string[] | undefined): string[] | undefined {
		if (!tags) return undefined;

		return tags
			.map((tag) => tag.toLowerCase().trim())
			.filter((tag, index, self) => self.indexOf(tag) === index);
	}

	private trimWhitespace(item: ContentItem): ContentItem {
		const trimmed: ContentItem = { ...item };

		for (const [key, value] of Object.entries(item)) {
			if (typeof value === "string") {
				(trimmed as any)[key] = value.trim();
			}
		}

		return trimmed;
	}

	customTransform<T = ContentItem>(
		items: T[],
		transformFn: (item: T) => T,
	): T[] {
		return items.map(transformFn);
	}

	chainTransform<T = ContentItem>(
		items: T[],
		transforms: ((item: T) => T)[],
	): T[] {
		let result = items;

		for (const transform of transforms) {
			result = result.map(transform);
		}

		return result;
	}
}

let transformerInstance: ContentTransformer | null = null;

export function getContentTransformer(): ContentTransformer {
	if (!transformerInstance) {
		transformerInstance = new ContentTransformer();
	}
	return transformerInstance;
}
