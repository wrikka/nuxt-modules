export interface AnalyticsDashboard {
	overview: {
		totalContent: number;
		totalViews: number;
		totalVisitors: number;
		avgReadingTime: number;
		avgEngagement: number;
	};
	topContent: Array<{
		_path: string;
		title: string;
		views: number;
		engagement: number;
	}>;
	recentActivity: Array<{
		type: "view" | "comment" | "update" | "publish";
		_path: string;
		timestamp: string;
	}>;
	trends: {
		views: Array<{ date: string; count: number }>;
		engagement: Array<{ date: string; score: number }>;
	};
}

export class ContentAnalyticsDashboard {
	private views: Map<string, number> = new Map();
	private visitors: Map<string, Set<string>> = new Map();
	private readingTimes: Map<string, number[]> = new Map();
	private engagement: Map<string, number> = new Map();
	private recentActivity: Array<{
		type: "view" | "comment" | "update" | "publish";
		_path: string;
		timestamp: string;
	}> = [];

	trackView(_path: string, _userId: string): void {
		const currentViews = this.views.get(_path) || 0;
		this.views.set(_path, currentViews + 1);

		if (!this.visitors.has(_path)) {
			this.visitors.set(_path, new Set());
		}
		this.visitors.get(_path)!.add(_userId);

		this.addRecentActivity("view", _path);
	}

	trackReadingTime(_path: string, seconds: number): void {
		if (!this.readingTimes.has(_path)) {
			this.readingTimes.set(_path, []);
		}
		this.readingTimes.get(_path)!.push(seconds);
	}

	trackEngagement(_path: string, score: number): void {
		const currentEngagement = this.engagement.get(_path) || 0;
		this.engagement.set(_path, currentEngagement + score);
	}

	addRecentActivity(
		type: "view" | "comment" | "update" | "publish",
		_path: string,
	): void {
		this.recentActivity.unshift({
			type,
			_path,
			timestamp: new Date().toISOString(),
		});

		if (this.recentActivity.length > 50) {
			this.recentActivity = this.recentActivity.slice(0, 50);
		}
	}

	getOverview() {
		const totalContent = this.views.size;
		const totalViews = Array.from(this.views.values()).reduce((sum, v) => sum + v, 0);
		const totalVisitors = Array.from(this.visitors.values()).reduce((sum, visitors) => sum + visitors.size, 0);

		const allReadingTimes = Array.from(this.readingTimes.values()).flat();
		const avgReadingTime = allReadingTimes.length > 0
			? allReadingTimes.reduce((sum, t) => sum + t, 0) / allReadingTimes.length
			: 0;

		const allEngagement = Array.from(this.engagement.values());
		const avgEngagement = allEngagement.length > 0
			? allEngagement.reduce((sum, e) => sum + e, 0) / allEngagement.length
			: 0;

		return {
			totalContent,
			totalViews,
			totalVisitors,
			avgReadingTime,
			avgEngagement,
		};
	}

	getTopContent(limit = 10) {
		const top = Array.from(this.views.entries())
			.map(([_path, views]) => ({
				_path,
				views,
				engagement: this.engagement.get(_path) || 0,
			}))
			.sort((a, b) => b.views - a.views)
			.slice(0, limit);

		return top.map((item) => ({
			...item,
			title: item._path.split("/").pop() || item._path,
		}));
	}

	getRecentActivity(limit = 10) {
		return this.recentActivity.slice(0, limit);
	}

	getTrends(days = 7) {
		const now = new Date();
		const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

		const viewsByDate = new Map<string, number>();
		const engagementByDate = new Map<string, number>();

		for (let i = 0; i < days; i++) {
			const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
			const dateStr = date.toISOString().split("T")[0];
			viewsByDate.set(dateStr, 0);
			engagementByDate.set(dateStr, 0);
		}

		const views = Array.from(viewsByDate.entries()).map(([date, count]) => ({
			date,
			count,
		}));

		const engagement = Array.from(engagementByDate.entries()).map(([date, score]) => ({
			date,
			score,
		}));

		return { views, engagement };
	}

	getContentStats(_path: string) {
		const views = this.views.get(_path) || 0;
		const visitors = this.visitors.get(_path)?.size || 0;
		const readingTimes = this.readingTimes.get(_path) || [];
		const avgReadingTime = readingTimes.length > 0
			? readingTimes.reduce((sum, t) => sum + t, 0) / readingTimes.length
			: 0;
		const engagement = this.engagement.get(_path) || 0;

		return {
			views,
			visitors,
			avgReadingTime,
			engagement,
		};
	}

	getStats() {
		const overview = this.getOverview();
		const topContent = this.getTopContent(5);
		const recentActivity = this.getRecentActivity(5);
		const trends = this.getTrends(7);

		return {
			overview,
			topContent,
			recentActivity,
			trends,
		};
	}

	clear(): void {
		this.views.clear();
		this.visitors.clear();
		this.readingTimes.clear();
		this.engagement.clear();
		this.recentActivity = [];
	}
}

let analyticsDashboardInstance: ContentAnalyticsDashboard | null = null;

export function getContentAnalyticsDashboard(): ContentAnalyticsDashboard {
	if (!analyticsDashboardInstance) {
		analyticsDashboardInstance = new ContentAnalyticsDashboard();
	}
	return analyticsDashboardInstance;
}
