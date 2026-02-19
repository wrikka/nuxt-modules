import type { ContentItem } from "../../../shared/types";

export interface AnalyticsConfig {
	enableTracking: boolean;
	trackViews: boolean;
	trackEngagement: boolean;
	trackScrollDepth: boolean;
	trackTimeOnPage: boolean;
}

export interface ContentAnalytics {
	views: number;
	uniqueViews: number;
	avgTimeOnPage: number;
	scrollDepth: number;
	engagementScore: number;
	bounceRate: number;
	lastViewedAt: string;
}

export class ContentAnalyticsService {
	private config: AnalyticsConfig;
	private analytics: Map<string, ContentAnalytics> = new Map();
	private sessionViews: Set<string> = new Set();

	constructor(config?: AnalyticsConfig) {
		this.config = config || {
			enableTracking: true,
			trackViews: true,
			trackEngagement: true,
			trackScrollDepth: true,
			trackTimeOnPage: true,
		};
	}

	trackView(content: ContentItem, sessionId?: string): void {
		if (!this.config.enableTracking || !this.config.trackViews) return;

		const path = content._path;
		const analytics = this.analytics.get(path) || {
			views: 0,
			uniqueViews: 0,
			avgTimeOnPage: 0,
			scrollDepth: 0,
			engagementScore: 0,
			bounceRate: 100,
			lastViewedAt: new Date().toISOString(),
		};

		analytics.views++;
		analytics.lastViewedAt = new Date().toISOString();

		// Track unique views
		const sessionKey = sessionId || this.generateSessionId();
		if (!this.sessionViews.has(`${sessionKey}:${path}`)) {
			analytics.uniqueViews++;
			this.sessionViews.add(`${sessionKey}:${path}`);
		}

		this.analytics.set(path, analytics);
	}

	trackTimeOnPage(content: ContentItem, timeSpent: number): void {
		if (!this.config.enableTracking || !this.config.trackTimeOnPage) return;

		const path = content._path;
		const analytics = this.analytics.get(path);

		if (!analytics) return;

		// Update average time on page
		const totalViews = analytics.views;
		const oldAvg = analytics.avgTimeOnPage;
		analytics.avgTimeOnPage = (oldAvg * (totalViews - 1) + timeSpent) / totalViews;

		this.analytics.set(path, analytics);
	}

	trackScrollDepth(content: ContentItem, depth: number): void {
		if (!this.config.enableTracking || !this.config.trackScrollDepth) return;

		const path = content._path;
		const analytics = this.analytics.get(path);

		if (!analytics) return;

		// Update average scroll depth
		const totalViews = analytics.views;
		const oldDepth = analytics.scrollDepth;
		analytics.scrollDepth = (oldDepth * (totalViews - 1) + depth) / totalViews;

		this.analytics.set(path, analytics);
	}

	trackEngagement(content: ContentItem, score: number): void {
		if (!this.config.enableTracking || !this.config.trackEngagement) return;

		const path = content._path;
		const analytics = this.analytics.get(path);

		if (!analytics) return;

		// Update engagement score
		const totalViews = analytics.views;
		const oldScore = analytics.engagementScore;
		analytics.engagementScore = (oldScore * (totalViews - 1) + score) / totalViews;

		this.analytics.set(path, analytics);
	}

	trackBounce(content: ContentItem, isBounce: boolean): void {
		if (!this.config.enableTracking) return;

		const path = content._path;
		const analytics = this.analytics.get(path);

		if (!analytics) return;

		// Update bounce rate
		const totalViews = analytics.views;
		const oldRate = analytics.bounceRate;
		const bounceCount = (oldRate / 100) * (totalViews - 1);
		const newCount = isBounce ? bounceCount + 1 : bounceCount;
		analytics.bounceRate = (newCount / totalViews) * 100;

		this.analytics.set(path, analytics);
	}

	getAnalytics(content: ContentItem): ContentAnalytics | null {
		return this.analytics.get(content._path) || null;
	}

	getAllAnalytics(): Map<string, ContentAnalytics> {
		return new Map(this.analytics);
	}

	getPopularContent(limit: number = 10): Array<{ path: string; views: number }> {
		const result: Array<{ path: string; views: number }> = [];

		for (const [path, analytics] of this.analytics.entries()) {
			result.push({ path, views: analytics.views });
		}

		return result.sort((a, b) => b.views - a.views).slice(0, limit);
	}

	getEngagingContent(limit: number = 10): Array<{ path: string; engagementScore: number }> {
		const result: Array<{ path: string; engagementScore: number }> = [];

		for (const [path, analytics] of this.analytics.entries()) {
			result.push({ path, engagementScore: analytics.engagementScore });
		}

		return result.sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
	}

	getBounceRate(content: ContentItem): number {
		const analytics = this.analytics.get(content._path);
		return analytics ? analytics.bounceRate : 100;
	}

	getAvgTimeOnPage(content: ContentItem): number {
		const analytics = this.analytics.get(content._path);
		return analytics ? analytics.avgTimeOnPage : 0;
	}

	getScrollDepth(content: ContentItem): number {
		const analytics = this.analytics.get(content._path);
		return analytics ? analytics.scrollDepth : 0;
	}

	clearAnalytics(content?: ContentItem): void {
		if (content) {
			this.analytics.delete(content._path);
		} else {
			this.analytics.clear();
		}
	}

	private generateSessionId(): string {
		return crypto.randomUUID();
	}

	getConfig(): AnalyticsConfig {
		return this.config;
	}
}

// Singleton instance
let analyticsInstance: ContentAnalyticsService | null = null;

export function useContentAnalytics(config?: AnalyticsConfig): ContentAnalyticsService {
	if (!analyticsInstance) {
		analyticsInstance = new ContentAnalyticsService(config);
	}
	return analyticsInstance;
}

// Helper composable for analytics
export function useContentAnalyticsHelper(content: ContentItem) {
	const analytics = useContentAnalytics();

	return {
		trackView: (sessionId?: string) => analytics.trackView(content, sessionId),
		trackTimeOnPage: (timeSpent: number) => analytics.trackTimeOnPage(content, timeSpent),
		trackScrollDepth: (depth: number) => analytics.trackScrollDepth(content, depth),
		trackEngagement: (score: number) => analytics.trackEngagement(content, score),
		trackBounce: (isBounce: boolean) => analytics.trackBounce(content, isBounce),
		getAnalytics: () => analytics.getAnalytics(content),
		getBounceRate: () => analytics.getBounceRate(content),
		getAvgTimeOnPage: () => analytics.getAvgTimeOnPage(content),
		getScrollDepth: () => analytics.getScrollDepth(content),
	};
}
