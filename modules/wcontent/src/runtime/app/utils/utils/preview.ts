import type { ContentItem } from "../../../shared/types";

export interface PreviewConfig {
	enabled: boolean;
	previewUrl?: string;
	previewToken?: string;
}

export interface PreviewResult {
	url: string;
	token: string;
	expiresAt: number;
}

export class ContentPreview {
	private config: PreviewConfig = {
		enabled: true,
	};

	private previews: Map<string, PreviewResult> = new Map();

	setConfig(config: Partial<PreviewConfig>) {
		this.config = { ...this.config, ...config };
	}

	async createPreview(item: ContentItem): Promise<PreviewResult> {
		if (!this.config.enabled) {
			throw new Error("Preview is not enabled");
		}

		const token = this.generateToken(item.__path);
		const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

		const result: PreviewResult = {
			url: `${this.config.previewUrl || "/preview"}/${item.__path}`,
			token,
			expiresAt,
		};

		this.previews.set(token, result);

		return result;
	}

	async validatePreview(token: string, _path: string): Promise<boolean> {
		const preview = this.previews.get(token);

		if (!preview) {
			return false;
		}

		// Check if preview has expired
		if (Date.now() > preview.expiresAt) {
			this.previews.delete(token);
			return false;
		}

		// Check if _path matches
		if (!preview.url.includes(_path)) {
			return false;
		}

		return true;
	}

	getPreviewUrl(item: ContentItem): string {
		if (!this.config.enabled) {
			return item.__path;
		}

		return `/preview/${item.__path}`;
	}

	generatePreviewLink(item: ContentItem): string {
		const previewUrl = this.getPreviewUrl(item);
		const token = this.generateToken(item.__path);

		return `${previewUrl}?token=${token}`;
	}

	private generateToken(_path: string): string {
		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 15);
		return Buffer.from(`${_path}:${timestamp}:${random}`).toString("base64");
	}

	cleanupExpiredPreviews() {
		const now = Date.now();

		for (const [token, preview] of this.previews.entries()) {
			if (now > preview.expiresAt) {
				this.previews.delete(token);
			}
		}
	}

	getStats() {
		const now = Date.now();
		const active = Array.from(this.previews.values()).filter(p => now <= p.expiresAt);
		const expired = Array.from(this.previews.values()).filter(p => now > p.expiresAt);

		return {
			total: this.previews.size,
			active: active.length,
			expired: expired.length,
		};
	}
}

let previewInstance: ContentPreview | null = null;

export function getContentPreview(): ContentPreview {
	if (!previewInstance) {
		previewInstance = new ContentPreview();
	}
	return previewInstance;
}
