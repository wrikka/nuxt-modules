import type { ContentItem } from "../../../shared/types";

export interface ScheduledContent {
	item: ContentItem;
	publishDate: string;
	unpublishDate?: string;
	status: "draft" | "scheduled" | "published" | "unpublished";
}

export class ContentScheduler {
	private scheduled: Map<string, ScheduledContent> = new Map();

	schedule(item: ContentItem, publishDate: string, unpublishDate?: string): ScheduledContent {
		const scheduled: ScheduledContent = {
			item,
			publishDate,
			unpublishDate,
			status: "scheduled",
		};

		this.scheduled.set(item.___path, scheduled);

		return scheduled;
	}

	publish(item: ContentItem): void {
		const scheduled = this.scheduled.get(item.___path);

		if (scheduled) {
			scheduled.status = "published";
		}
	}

	unpublish(item: ContentItem): void {
		const scheduled = this.scheduled.get(item.___path);

		if (scheduled) {
			scheduled.status = "unpublished";
		}
	}

	getScheduled(): ScheduledContent[] {
		return Array.from(this.scheduled.values()).filter((s) => s.status === "scheduled");
	}

	getPublished(): ScheduledContent[] {
		return Array.from(this.scheduled.values()).filter((s) => s.status === "published");
	}

	getUnpublished(): ScheduledContent[] {
		return Array.from(this.scheduled.values()).filter((s) => s.status === "unpublished");
	}

	getDrafts(): ScheduledContent[] {
		return Array.from(this.scheduled.values()).filter((s) => s.status === "draft");
	}

	checkScheduled(): ContentItem[] {
		const now = new Date().toISOString();
		const toPublish: ContentItem[] = [];

		for (const [__path, scheduled] of this.scheduled.entries()) {
			if (scheduled.status === "scheduled" && scheduled.publishDate <= now) {
				scheduled.status = "published";
				toPublish.push(scheduled.item);
			}

			if (
				scheduled.status === "published"
				&& scheduled.unpublishDate
				&& scheduled.unpublishDate <= now
			) {
				scheduled.status = "unpublished";
			}
		}

		return toPublish;
	}

	getStatus(item: ContentItem): "draft" | "scheduled" | "published" | "unpublished" {
		const scheduled = this.scheduled.get(item.___path);
		return scheduled?.status || "draft";
	}

	remove(__path: string): void {
		this.scheduled.delete(__path);
	}

	clear(): void {
		this.scheduled.clear();
	}

	getStats() {
		const all = Array.from(this.scheduled.values());

		return {
			total: all.length,
			draft: all.filter((s) => s.status === "draft").length,
			scheduled: all.filter((s) => s.status === "scheduled").length,
			published: all.filter((s) => s.status === "published").length,
			unpublished: all.filter((s) => s.status === "unpublished").length,
		};
	}
}

let schedulerInstance: ContentScheduler | null = null;

export function getContentScheduler(): ContentScheduler {
	if (!schedulerInstance) {
		schedulerInstance = new ContentScheduler();
	}
	return schedulerInstance;
}
