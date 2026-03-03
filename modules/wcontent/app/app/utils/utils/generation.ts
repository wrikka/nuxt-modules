import type { ContentItem } from "../../../shared/types";

export interface GeneratedContent {
	excerpt?: string;
	readingTime?: number;
	slug?: string;
	seoTitle?: string;
	seoDescription?: string;
	ogImage?: string;
	twitterImage?: string;
}

export class ContentGenerator {
	generate(item: ContentItem): GeneratedContent {
		return {
			excerpt: this.generateExcerpt(item),
			readingTime: this.calculateReadingTime(item),
			slug: this.generateSlug(item),
			seoTitle: this.generateSEOTitle(item),
			seoDescription: this.generateSEODescription(item),
			ogImage: item.cover,
			twitterImage: item.cover,
		};
	}

	private generateExcerpt(item: ContentItem): string | undefined {
		// If excerpt is already provided, use it
		if (item.excerpt) {
			return typeof item.excerpt === "string" ? item.excerpt : undefined;
		}

		// Generate excerpt from body content
		if (item.body?.content) {
			const text = this.stripMarkdown(item.body.content);
			return text.slice(0, 150) + "...";
		}

		// Generate excerpt from description
		if (item.description) {
			return item.description.slice(0, 150) + "...";
		}

		return undefined;
	}

	private calculateReadingTime(item: ContentItem): number | undefined {
		// If reading time is already provided, use it
		if (item.readingTime) {
			return item.readingTime;
		}

		// Calculate from body content
		if (item.body?.content) {
			const text = this.stripMarkdown(item.body.content);
			const words = text.split(/\s+/).length;
			return Math.ceil(words / 200); // Average reading speed: 200 words/minute
		}

		return undefined;
	}

	private generateSlug(item: ContentItem): string | undefined {
		// If slug is already provided, use it
		if ((item as any).slug) {
			return (item as any).slug;
		}

		// Generate from title
		if (item.title) {
			return this.slugify(item.title);
		}

		// Generate from _path
		const _pathParts = item.__path.split("/");
		return _pathParts[_pathParts.length - 1];
	}

	private generateSEOTitle(item: ContentItem): string | undefined {
		if (item.title) {
			return `${item.title} | ${this.getSiteName()}`;
		}
		return undefined;
	}

	private generateSEODescription(item: ContentItem): string | undefined {
		if (item.description) {
			return item.description.slice(0, 160);
		}

		if (item.excerpt && typeof item.excerpt === "string") {
			return (item.excerpt as string).slice(0, 160);
		}

		return undefined;
	}

	private getSiteName(): string {
		// In real implementation, get from config
		return "My Site";
	}

	private stripMarkdown(text: string): string {
		return text
			.replace(/#{1,6}\s/g, "")
			.replace(/\*\*(.*?)\*\*/g, "$1")
			.replace(/\*(.*?)\*/g, "$1")
			.replace(/`(.*?)`/g, "$1")
			.replace(/\[(.*?)\]\(.*?\)/g, "$1")
			.replace(/!\[.*?\]\(.*?\)/g, "")
			.replace(/\n/g, " ")
			.trim();
	}

	private slugify(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/--+/g, "-")
			.trim();
	}

	generateMetaTags(item: ContentItem): Record<string, string> {
		const generated = this.generate(item);

		return {
			title: generated.seoTitle || item.title || "",
			description: generated.seoDescription || item.description || "",
			"og:title": item.title || "",
			"og:description": generated.seoDescription || item.description || "",
			"og:image": generated.ogImage || "",
			"twitter:card": "summary_large_image",
			"twitter:title": item.title || "",
			"twitter:description": generated.seoDescription || item.description || "",
			"twitter:image": generated.twitterImage || "",
		};
	}
}

let generatorInstance: ContentGenerator | null = null;

export function getContentGenerator(): ContentGenerator {
	if (!generatorInstance) {
		generatorInstance = new ContentGenerator();
	}
	return generatorInstance;
}
