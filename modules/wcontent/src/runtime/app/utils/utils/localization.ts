import type { ContentItem } from "../../../shared/types";

export interface LocalizedContent {
	_path: string;
	locale: string;
	content: ContentItem;
	translations: Record<string, string>;
}

export class ContentLocalization {
	private localized: Map<string, LocalizedContent> = new Map();

	addLocalizedContent(
		_path: string,
		locale: string,
		content: ContentItem,
		translations: Record<string, string> = {},
	): void {
		const key = `${_path}:${locale}`;
		this.localized.set(key, {
			_path,
			locale,
			content,
			translations,
		});
	}

	getLocalizedContent(_path: string, locale: string): LocalizedContent | null {
		const key = `${_path}:${locale}`;
		return this.localized.get(key) || null;
	}

	getAllLocales(_path: string): string[] {
		const locales = new Set<string>();

		for (const [key] of this.localized.entries()) {
			if (key.startsWith(`${_path}:`)) {
				const locale = key.split(":")[1];
				locales.add(locale);
			}
		}

		return Array.from(locales);
	}

	getTranslations(_path: string, locale: string): Record<string, string> {
		const localized = this.getLocalizedContent(_path, locale);
		return localized?.translations || {};
	}

	removeLocalizedContent(_path: string, locale: string): void {
		const key = `${_path}:${locale}`;
		this.localized.delete(key);
	}

	getStats() {
		const _paths = new Set<string>();

		for (const [key] of this.localized.entries()) {
			const _path = key.split(":")[0];
			_paths.add(_path);
		}

		return {
			totalLocalized: this.localized.size,
			total_paths: _paths.size,
		};
	}
}

let localizationInstance: ContentLocalization | null = null;

export function getContentLocalization(): ContentLocalization {
	if (!localizationInstance) {
		localizationInstance = new ContentLocalization();
	}
	return localizationInstance;
}
