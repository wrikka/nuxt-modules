export interface SecurityConfig {
	enableXSSProtection: boolean;
	enableCSRFProtection: boolean;
	enableContentSanitization: boolean;
	allowedTags?: string[];
	allowedAttributes?: Record<string, string[]>;
}

export class ContentSecurity {
	private config: SecurityConfig;
	private purify: any;

	constructor(config: SecurityConfig) {
		this.config = config;
		// Dynamic import to avoid build issues
		this.purify = null;
	}

	private async loadPurify() {
		if (!this.purify) {
			const { default: purify } = await import("dompurify");
			this.purify = purify;
		}
		return this.purify;
	}

	async sanitizeHTML(html: string): Promise<string> {
		if (!this.config.enableContentSanitization) {
			return html;
		}

		const purify = await this.loadPurify();
		return purify.sanitize(html, {
			ALLOWED_TAGS: this.config.allowedTags,
			ALLOWED_ATTR: this.config.allowedAttributes
				? Object.values(this.config.allowedAttributes).flat()
				: undefined,
		});
	}

	sanitizeText(text: string): string {
		if (!this.config.enableXSSProtection) {
			return text;
		}

		// Basic XSS protection for plain text
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	validateURL(url: string): boolean {
		try {
			const parsed = new URL(url);
			// Only allow http, https protocols
			return ["http:", "https:"].includes(parsed.protocol);
		} catch {
			return false;
		}
	}

	sanitizeURL(url: string): string {
		if (!this.validateURL(url)) {
			return "";
		}
		return url;
	}

	generateCSRFToken(): string {
		return crypto.randomUUID();
	}

	validateCSRFToken(token: string, sessionToken: string): boolean {
		return token === sessionToken;
	}

	escapeJSON(json: string): string {
		return json
			.replace(/&/g, "\\u0026")
			.replace(/</g, "\\u003c")
			.replace(/>/g, "\\u003e")
			.replace(/"/g, "\\u0022")
			.replace(/'/g, "\\u0027");
	}

	validateContent(content: any): boolean {
		if (typeof content === "string") {
			// Check for common XSS patterns
			const xssPatterns = [
				/<script/i,
				/<iframe/i,
				/<object/i,
				/<embed/i,
				/on\w+\s*=/i,
				/javascript:/i,
				/vbscript:/i,
				/data:/i,
			];

			return !xssPatterns.some((pattern) => pattern.test(content));
		}

		if (typeof content === "object" && content !== null) {
			for (const value of Object.values(content)) {
				if (!this.validateContent(value)) {
					return false;
				}
			}
		}

		return true;
	}

	getConfig(): SecurityConfig {
		return this.config;
	}
}

// Singleton instance
let securityInstance: ContentSecurity | null = null;

export function useContentSecurity(config?: SecurityConfig): ContentSecurity {
	if (!securityInstance) {
		securityInstance = new ContentSecurity(
			config || {
				enableXSSProtection: true,
				enableCSRFProtection: true,
				enableContentSanitization: true,
			},
		);
	}
	return securityInstance;
}

// Helper composable for security
export function useContentSecurityHelper() {
	const security = useContentSecurity();

	return {
		sanitizeHTML: (html: string) => security.sanitizeHTML(html),
		sanitizeText: (text: string) => security.sanitizeText(text),
		sanitizeURL: (url: string) => security.sanitizeURL(url),
		validateContent: (content: any) => security.validateContent(content),
		generateCSRFToken: () => security.generateCSRFToken(),
		validateCSRFToken: (token: string, sessionToken: string) => security.validateCSRFToken(token, sessionToken),
	};
}
