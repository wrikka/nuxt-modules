import type { ContentItem } from "../../../shared/types";

export interface SEOConfig {
	defaultTitle: string;
	defaultDescription: string;
	defaultImage?: string;
	siteName: string;
	siteUrl: string;
	twitterHandle?: string;
}

export interface SEOMetadata {
	title?: string;
	description?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: "website" | "article" | "profile";
	ogUrl?: string;
	ogSiteName?: string;
	twitterCard?: "summary_large_image" | "summary" | "app" | "player";
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	twitterSite?: string;
	canonical?: string;
	robots?: string;
	keywords?: string[];
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
	articleSection?: string;
	articleTags?: string[];
}

export class ContentSEO {
	private config: SEOConfig;

	constructor(config: SEOConfig) {
		this.config = config;
	}

	generateMetadata(content: ContentItem, currentUrl?: string): SEOMetadata {
		const title = content.title || this.config.defaultTitle;
		const description = content.description || this.config.defaultDescription;
		const url = currentUrl || `${this.config.siteUrl}${content._path}`;

		const metadata: SEOMetadata = {
			title,
			description,
			ogTitle: title,
			ogDescription: description,
			ogType: "article",
			ogUrl: url,
			ogSiteName: this.config.siteName,
			twitterCard: "summary_large_image",
			twitterTitle: title,
			twitterDescription: description,
			twitterSite: this.config.twitterHandle,
			canonical: url,
			robots: "index, follow",
			keywords: content.tags,
			author: content.author,
			publishedTime: content.date,
			modifiedTime: content.updatedDate,
			articleSection: content.category,
			articleTags: content.tags,
		};

		// Add OG image if available
		if (content.cover) {
			metadata.ogImage = content.cover;
			metadata.twitterImage = content.cover;
		} else if (this.config.defaultImage) {
			metadata.ogImage = this.config.defaultImage;
			metadata.twitterImage = this.config.defaultImage;
		}

		return metadata;
	}

	generateStructuredData(content: ContentItem): any {
		const url = `${this.config.siteUrl}${content._path}`;

		const structuredData = {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: content.title,
			description: content.description,
			image: content.cover || this.config.defaultImage,
			author: {
				"@type": "Person",
				name: content.author || this.config.siteName,
			},
			publisher: {
				"@type": "Organization",
				name: this.config.siteName,
				url: this.config.siteUrl,
			},
			datePublished: content.date,
			dateModified: content.updatedDate || content.date,
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": url,
			},
		};

		return structuredData;
	}

	generateBreadcrumbs(content: ContentItem): Array<{ name: string; url: string }> {
		const breadcrumbs: Array<{ name: string; url: string }> = [];

		// Home
		breadcrumbs.push({
			name: "Home",
			url: this.config.siteUrl,
		});

		// Category
		if (content.category) {
			breadcrumbs.push({
				name: content.category,
				url: `${this.config.siteUrl}/category/${content.category}`,
			});
		}

		// Content
		breadcrumbs.push({
			name: content.title || "",
			url: `${this.config.siteUrl}${content._path}`,
		});

		return breadcrumbs;
	}

	getConfig(): SEOConfig {
		return this.config;
	}
}

// Singleton instance
let seoInstance: ContentSEO | null = null;

export function useContentSEO(config?: SEOConfig): ContentSEO {
	if (!seoInstance) {
		seoInstance = new ContentSEO(
			config || {
				defaultTitle: "My Blog",
				defaultDescription: "A blog about technology and programming",
				siteName: "My Blog",
				siteUrl: "https://example.com",
			},
		);
	}
	return seoInstance;
}

// Helper composable for SEO
export function useSEO(content: ContentItem, currentUrl?: string) {
	const seo = useContentSEO();

	return {
		generateMetadata: () => seo.generateMetadata(content, currentUrl),
		generateStructuredData: () => seo.generateStructuredData(content),
		generateBreadcrumbs: () => seo.generateBreadcrumbs(content),
	};
}
