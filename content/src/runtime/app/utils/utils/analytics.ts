import type { ContentItem } from "../../../shared/types";

export interface AnalyticsData {
	views: number;
	uniqueVisitors: number;
	avgReadingTime: number;
	bounceRate: number;
	engagement: number;
	lastViewed?: string;
}

export interface ContentAnalytics {
	_path: string;
	data: AnalyticsData;
	history: AnalyticsData[];
}

export class ContentAnalyticsTracker {
	private analytics: Map<string, ContentAnalytics> = new Map();

	trackView(item: ContentItem): void {
		const analytics = this.getAnalytics(item.__path);

		analytics.data.views++;
		analytics.data.lastViewed = new Date().toISOString();

		this.analytics.set(item.__path, analytics);
	}

	trackVisitor(item: ContentItem): void {
		const analytics = this.getAnalytics(item.__path);

		analytics.data.uniqueVisitors++;

		this.analytics.set(item.__path, analytics);
	}

	trackReadingTime(item: ContentItem, readingTime: number): void {
		const analytics = this.getAnalytics(item.__path);

		const totalReadingTime = analytics.data.avgReadingTime * (analytics.data.views - 1) + readingTime;
		analytics.data.avgReadingTime = totalReadingTime / analytics.data.views;

		this.analytics.set(item.__path, analytics);
	}

	trackEngagement(item: ContentItem, engagement: number): void {
		const analytics = this.getAnalytics(item.__path);

		const totalEngagement = analytics.data.engagement * (analytics.data.views - 1) + engagement;
		analytics.data.engagement = totalEngagement / analytics.data.views;

		this.analytics.set(item.__path, analytics);
	}

	trackBounce(item: ContentItem): void {
		const analytics = this.getAnalytics(item.__path);

		const totalBounces = analytics.data.bounceRate * (analytics.data.views - 1) + 1;
		analytics.data.bounceRate = totalBounces / analytics.data.views;

		this.analytics.set(item.__path, analytics);
	}

	getAnalytics(_path: string): ContentAnalytics {
		const analytics = this.analytics.get(_path);

		if (!analytics) {
			const newAnalytics: ContentAnalytics = {
				_path,
				data: {
					views: 0,
					uniqueVisitors: 0,
					avgReadingTime: 0,
					bounceRate: 0,
					engagement: 0,
				},
				history: [],
			};

			this.analytics.set(_path, newAnalytics);
			return newAnalytics;
		}

		return analytics;
	}

	getTopContent(limit: number = 10): ContentAnalytics[] {
		return Array.from(this.analytics.values())
			.sort((a, b) => b.data.views - a.data.views)
			.slice(0, limit);
	}

	getMostEngaged(limit: number = 10): ContentAnalytics[] {
		return Array.from(this.analytics.values())
			.sort((a, b) => b.data.engagement - a.data.engagement)
			.slice(0, limit);
	}

	getTrending(limit: number = 10): ContentAnalytics[] {
		const now = Date.now();
		const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

		return Array.from(this.analytics.values())
			.filter((a) => a.data.lastViewed && new Date(a.data.lastViewed).getTime() > oneWeekAgo)
			.sort((a, b) => b.data.views - a.data.views)
			.slice(0, limit);
	}

	getStats() {
		const all = Array.from(this.analytics.values());

		return {
			totalViews: all.reduce((sum, a) => sum + a.data.views, 0),
			totalUniqueVisitors: all.reduce((sum, a) => sum + a.data.uniqueVisitors, 0),
			avgReadingTime: all.length > 0 ? all.reduce((sum, a) => sum + a.data.avgReadingTime, 0) / all.length : 0,
			avgBounceRate: all.length > 0 ? all.reduce((sum, a) => sum + a.data.bounceRate, 0) / all.length : 0,
			avgEngagement: all.length > 0 ? all.reduce((sum, a) => sum + a.data.engagement, 0) / all.length : 0,
			totalContent: all.length,
		};
	}

	exportData(): ContentAnalytics[] {
		return Array.from(this.analytics.values());
	}

	importData(data: ContentAnalytics[]): void {
		for (const analytics of data) {
			this.analytics.set(analytics._path, analytics);
		}
	}

	clear(): void {
		this.analytics.clear();
	}
}

let analyticsInstance: ContentAnalyticsTracker | null = null;

export function getContentAnalytics(): ContentAnalyticsTracker {
	if (!analyticsInstance) {
		analyticsInstance = new ContentAnalyticsTracker();
	}
	return analyticsInstance;
}
