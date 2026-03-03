import type { ContentItem } from "../../../shared/types";

export interface DraftConfig {
	enablePreviewMode: boolean;
	enableDraftMode: boolean;
	previewURL?: string;
}

export interface DraftContent extends ContentItem {
	status: "draft" | "published" | "scheduled";
	publishedAt?: string;
	scheduledAt?: string;
	previewToken?: string;
}

export class ContentDraft {
	private config: DraftConfig;
	private drafts: Map<string, DraftContent> = new Map();

	constructor(config?: DraftConfig) {
		this.config = config || {
			enablePreviewMode: true,
			enableDraftMode: true,
		};
	}

	createDraft(content: ContentItem): DraftContent {
		if (!this.config.enableDraftMode) {
			throw new Error("Draft mode is not enabled");
		}

		const draft: DraftContent = {
			...content,
			status: "draft",
			previewToken: this.generatePreviewToken(),
		};

		this.drafts.set(content._path, draft);
		return draft;
	}

	updateDraft(content: ContentItem): DraftContent {
		const existing = this.drafts.get(content._path);
		if (!existing) {
			throw new Error(`Draft not found for ${content._path}`);
		}

		const updated: DraftContent = {
			...existing,
			...content,
			status: "draft",
		};

		this.drafts.set(content._path, updated);
		return updated;
	}

	publishDraft(path: string): DraftContent {
		const draft = this.drafts.get(path);
		if (!draft) {
			throw new Error(`Draft not found for ${path}`);
		}

		draft.status = "published";
		draft.publishedAt = new Date().toISOString();

		this.drafts.set(path, draft);
		return draft;
	}

	scheduleDraft(path: string, scheduledAt: Date): DraftContent {
		const draft = this.drafts.get(path);
		if (!draft) {
			throw new Error(`Draft not found for ${path}`);
		}

		draft.status = "scheduled";
		draft.scheduledAt = scheduledAt.toISOString();

		this.drafts.set(path, draft);
		return draft;
	}

	deleteDraft(path: string): void {
		this.drafts.delete(path);
	}

	getDraft(path: string): DraftContent | null {
		return this.drafts.get(path) || null;
	}

	getAllDrafts(): DraftContent[] {
		return Array.from(this.drafts.values()).filter((d) => d.status === "draft");
	}

	getScheduledDrafts(): DraftContent[] {
		return Array.from(this.drafts.values()).filter((d) => d.status === "scheduled");
	}

	getPublishedDrafts(): DraftContent[] {
		return Array.from(this.drafts.values()).filter((d) => d.status === "published");
	}

	generatePreviewToken(): string {
		return crypto.randomUUID();
	}

	getPreviewURL(content: ContentItem): string | null {
		if (!this.config.enablePreviewMode || !this.config.previewURL) {
			return null;
		}

		const draft = this.drafts.get(content._path);
		if (!draft || !draft.previewToken) {
			return null;
		}

		return `${this.config.previewURL}?token=${draft.previewToken}`;
	}

	isDraft(path: string): boolean {
		const draft = this.drafts.get(path);
		return draft ? draft.status === "draft" : false;
	}

	isPublished(path: string): boolean {
		const draft = this.drafts.get(path);
		return draft ? draft.status === "published" : false;
	}

	isScheduled(path: string): boolean {
		const draft = this.drafts.get(path);
		return draft ? draft.status === "scheduled" : false;
	}

	publishScheduled(): DraftContent[] {
		const now = new Date();
		const published: DraftContent[] = [];

		for (const [path, draft] of this.drafts.entries()) {
			if (draft.status === "scheduled" && draft.scheduledAt) {
				const scheduledDate = new Date(draft.scheduledAt);
				if (scheduledDate <= now) {
					const updated = this.publishDraft(path);
					published.push(updated);
				}
			}
		}

		return published;
	}

	clearDrafts(): void {
		this.drafts.clear();
	}

	getConfig(): DraftConfig {
		return this.config;
	}
}

// Singleton instance
let draftInstance: ContentDraft | null = null;

export function useContentDraft(config?: DraftConfig): ContentDraft {
	if (!draftInstance) {
		draftInstance = new ContentDraft(config);
	}
	return draftInstance;
}

// Helper composable for draft management
export function useDraftContent(content: ContentItem) {
	const draft = useContentDraft();

	return {
		createDraft: () => draft.createDraft(content),
		updateDraft: () => draft.updateDraft(content),
		publishDraft: () => draft.publishDraft(content._path),
		scheduleDraft: (scheduledAt: Date) => draft.scheduleDraft(content._path, scheduledAt),
		deleteDraft: () => draft.deleteDraft(content._path),
		getDraft: () => draft.getDraft(content._path),
		isDraft: () => draft.isDraft(content._path),
		isPublished: () => draft.isPublished(content._path),
		isScheduled: () => draft.isScheduled(content._path),
		getPreviewURL: () => draft.getPreviewURL(content),
	};
}
