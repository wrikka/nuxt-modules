import type { ContentItem } from "../../../shared/types";

export interface LocaleConfig {
	defaultLocale: string;
	locales: string[];
	fallbackLocale?: string;
}

export interface TranslatedContent extends ContentItem {
	locale: string;
	translations?: Record<string, string>;
}

export class ContentI18n {
	private config: LocaleConfig;
	private translations: Map<string, Map<string, ContentItem>> = new Map();

	constructor(config: LocaleConfig) {
		this.config = config;
	}

	setLocale(locale: string): void {
		if (!this.config.locales.includes(locale)) {
			throw new Error(`Locale "${locale}" is not supported`);
		}
	}

	getCurrentLocale(): string {
		return this.config.defaultLocale;
	}

	getSupportedLocales(): string[] {
		return this.config.locales;
	}

	addTranslation(content: ContentItem, locale: string): void {
		const key = this.getContentKey(content);
		if (!this.translations.has(key)) {
			this.translations.set(key, new Map());
		}
		this.translations.get(key)!.set(locale, content);
	}

	getTranslation(content: ContentItem, locale?: string): ContentItem | null {
		const targetLocale = locale || this.config.defaultLocale;
		const key = this.getContentKey(content);
		const translations = this.translations.get(key);

		if (!translations) return null;

		// Try to get the target locale
		let translated = translations.get(targetLocale);
		if (translated) return translated;

		// Fallback to default locale
		if (targetLocale !== this.config.defaultLocale) {
			translated = translations.get(this.config.defaultLocale);
			if (translated) return translated;
		}

		// Fallback to configured fallback locale
		if (this.config.fallbackLocale && this.config.fallbackLocale !== this.config.defaultLocale) {
			translated = translations.get(this.config.fallbackLocale);
			if (translated) return translated;
		}

		return null;
	}

	getAllTranslations(content: ContentItem): Record<string, ContentItem> {
		const key = this.getContentKey(content);
		const translations = this.translations.get(key);
		const result: Record<string, ContentItem> = {};

		if (translations) {
			for (const [locale, item] of translations.entries()) {
				result[locale] = item;
			}
		}

		return result;
	}

	getAvailableLocales(content: ContentItem): string[] {
		const key = this.getContentKey(content);
		const translations = this.translations.get(key);

		if (!translations) return [];

		return Array.from(translations.keys());
	}

	isTranslated(content: ContentItem, locale: string): boolean {
		const key = this.getContentKey(content);
		const translations = this.translations.get(key);
		return translations ? translations.has(locale) : false;
	}

	private getContentKey(content: ContentItem): string {
		return `${content._dir}:${content._path}`;
	}

	translateContent<T extends ContentItem>(
		content: T,
		locale?: string,
	): T | null {
		const translated = this.getTranslation(content, locale);
		return translated as T | null;
	}

	getLocaleContent(
		allContent: ContentItem[],
		locale?: string,
	): ContentItem[] {
		const targetLocale = locale || this.config.defaultLocale;

		const result: ContentItem[] = [];
		const processedKeys = new Set<string>();

		for (const content of allContent) {
			const key = this.getContentKey(content);

			// Skip if already processed
			if (processedKeys.has(key)) continue;

			// Get translation for target locale
			const translated = this.getTranslation(content, targetLocale);

			if (translated) {
				result.push(translated);
				processedKeys.add(key);
			}
		}

		return result;
	}
}

// Singleton instance
let i18nInstance: ContentI18n | null = null;

export function useContentI18n(config?: LocaleConfig): ContentI18n {
	if (!i18nInstance) {
		if (!config) {
			throw new Error("ContentI18n requires a config on first initialization");
		}
		i18nInstance = new ContentI18n(config);
	}
	return i18nInstance;
}

// Helper composable for i18n content
export function useI18nContent(content: ContentItem, allContent: ContentItem[]) {
	const i18n = useContentI18n();

	return {
		getTranslation: (locale?: string) => i18n.translateContent(content, locale),
		getAllTranslations: () => i18n.getAllTranslations(content),
		getAvailableLocales: () => i18n.getAvailableLocales(content),
		isTranslated: (locale: string) => i18n.isTranslated(content, locale),
		getLocaleContent: (locale?: string) => i18n.getLocaleContent(allContent, locale),
	};
}
