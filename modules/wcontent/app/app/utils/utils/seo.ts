import type { ContentItem } from "../../../shared/types";

export interface SEOConfig {
	siteUrl: string;
	siteName: string;
	defaultTitle: string;
	defaultDescription: string;
	defaultImage?: string;
	twitterHandle?: string;
	googleSiteVerification?: string;
}

export interface MetaTags {
	title: string;
	description: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	twitterCard?: "summary" | "summary_large_image";
	robots?: string;
	canonical?: string;
}

export interface StructuredData {
	"@context": string;
	"@type": string;
	[key: string]: any;
}

export class SEOOptimizer {
	private config: SEOConfig;

	constructor(config: SEOConfig) {
		this.config = config;
	}

	generateMetaTags(item: ContentItem): MetaTags {
		const title = item.title || this.config.defaultTitle;
		const description = item.description || this.config.defaultDescription;

		return {
			title: `${title} | ${this.config.siteName}`,
			description,
			ogTitle: title,
			ogDescription: description,
			ogImage: (item as any).cover || this.config.defaultImage,
			twitterCard: "summary_large_image",
			robots: "index, follow",
			canonical: `${this.config.siteUrl}${item.__path}`,
		};
	}

	generateArticleStructuredData(item: ContentItem): StructuredData {
		return {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: item.title,
			description: item.description,
			image: (item as any).cover,
			author: {
				"@type": "Person",
				name: (item as any).author,
			},
			datePublished: (item as any).date,
			dateModified: (item as any).updatedDate || (item as any).date,
			url: `${this.config.siteUrl}${item.__path}`,
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `${this.config.siteUrl}${item.__path}`,
			},
		};
	}

	generateBreadcrumbStructuredData(items: ContentItem[]): StructuredData {
		const itemListElement = items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.title,
			item: `${this.config.siteUrl}${item.__path}`,
		}));

		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement,
		};
	}

	generateWebsiteStructuredData(): StructuredData {
		return {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: this.config.siteName,
			url: this.config.siteUrl,
			potentialAction: {
				"@type": "SearchAction",
				target: `${this.config.siteUrl}/search?q={search_term_string}`,
				"query-input": "required name=search_term_string",
			},
		};
	}

	generateOrganizationStructuredData(): StructuredData {
		return {
			"@context": "https://schema.org",
			"@type": "Organization",
			name: this.config.siteName,
			url: this.config.siteUrl,
			logo: this.config.defaultImage,
		};
	}

	generateSitemap(items: ContentItem[]): string {
		const urls = items
			.map((item) => {
				const lastmod = (item as any).updatedDate || (item as any).date;
				const changefreq = lastmod ? "weekly" : "monthly";
				const priority = item.__path === "/" ? "1.0" : "0.8";

				return `  <url>
    <loc>${this.config.siteUrl}${item.__path}</loc>
    <lastmod>${lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
			})
			.join("\n");

		return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
	}

	generateRobotsTxt(): string {
		return `User-agent: *
Allow: /

Sitemap: ${this.config.siteUrl}/sitemap.xml
`;
	}

	generateMetaTagsHTML(meta: MetaTags): string {
		const tags = [];

		tags.push(`<title>${meta.title}</title>`);
		tags.push(`<meta name="description" content="${meta.description}">`);

		if (meta.ogTitle) {
			tags.push(`<meta property="og:title" content="${meta.ogTitle}">`);
		}
		if (meta.ogDescription) {
			tags.push(`<meta property="og:description" content="${meta.ogDescription}">`);
		}
		if (meta.ogImage) {
			tags.push(`<meta property="og:image" content="${meta.ogImage}">`);
		}
		if (meta.twitterCard) {
			tags.push(`<meta name="twitter:card" content="${meta.twitterCard}">`);
		}
		if (meta.robots) {
			tags.push(`<meta name="robots" content="${meta.robots}">`);
		}
		if (meta.canonical) {
			tags.push(`<link rel="canonical" href="${meta.canonical}">`);
		}

		return tags.join("\n");
	}

	generateStructuredDataHTML(data: StructuredData): string {
		return `<script type="application/ld+json">
${JSON.stringify(data, null, 2)}
</script>`;
	}
}

let seoInstance: SEOOptimizer | null = null;

export function getSEOOptimizer(config: SEOConfig): SEOOptimizer {
	if (!seoInstance) {
		seoInstance = new SEOOptimizer(config);
	}
	return seoInstance;
}
