export interface AnalyticsData {
	totalProjects: number;
	totalMedia: number;
	totalStorage: number;
	activeUsers: number;
	projectsByType: Record<string, number>;
	mediaByType: Record<string, number>;
	storageUsage: StorageUsage[];
	userActivity: UserActivity[];
}

export interface StorageUsage {
	date: Date;
	used: number;
	total: number;
}

export interface UserActivity {
	date: Date;
	sessions: number;
	actions: number;
}

export interface ProjectStats {
	id: string;
	name: string;
	type: string;
	views: number;
	edits: number;
	exports: number;
	lastModified: Date;
}

export interface MediaStats {
	id: string;
	name: string;
	type: string;
	size: number;
	views: number;
	downloads: number;
	createdAt: Date;
}

export interface UsageStats {
	projectId: string;
	projectName: string;
	storage: number;
	bandwidth: number;
	exports: number;
	period: "daily" | "weekly" | "monthly";
}

export interface Insight {
	id: string;
	type: "tip" | "warning" | "info";
	title: string;
	description: string;
	action?: string;
	priority: "low" | "medium" | "high";
	createdAt: Date;
}
