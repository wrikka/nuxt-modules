export interface PerformanceMetrics {
	loadTime: number;
	renderTime: number;
	cacheHitRate: number;
	errorCount: number;
	requestCount: number;
}

export interface PerformanceConfig {
	enableMonitoring: boolean;
	sampleRate: number;
	maxSamples: number;
}

export class ContentPerformanceMonitor {
	private config: PerformanceConfig;
	private metrics: Map<string, PerformanceMetrics> = new Map();
	private startTime: number = 0;
	private samples: PerformanceMetrics[] = [];

	constructor(config?: PerformanceConfig) {
		this.config = config || {
			enableMonitoring: true,
			sampleRate: 1,
			maxSamples: 1000,
		};
	}

	startMonitoring(): void {
		this.startTime = performance.now();
	}

	stopMonitoring(): number {
		return performance.now() - this.startTime;
	}

	trackLoad(contentPath: string, loadTime: number): void {
		if (!this.config.enableMonitoring) return;

		const metrics = this.metrics.get(contentPath) || {
			loadTime: 0,
			renderTime: 0,
			cacheHitRate: 0,
			errorCount: 0,
			requestCount: 0,
		};

		metrics.loadTime = loadTime;
		metrics.requestCount++;

		this.metrics.set(contentPath, metrics);
		this.addSample(metrics);
	}

	trackRender(contentPath: string, renderTime: number): void {
		if (!this.config.enableMonitoring) return;

		const metrics = this.metrics.get(contentPath);
		if (metrics) {
			metrics.renderTime = renderTime;
			this.addSample(metrics);
		}
	}

	trackCacheHit(contentPath: string, hit: boolean): void {
		if (!this.config.enableMonitoring) return;

		const metrics = this.metrics.get(contentPath);
		if (metrics) {
			const totalRequests = metrics.requestCount + 1;
			const hitCount = hit ? 1 : 0;
			metrics.cacheHitRate = (metrics.cacheHitRate * metrics.requestCount + hitCount) / totalRequests;
			metrics.requestCount = totalRequests;
			this.addSample(metrics);
		}
	}

	trackError(contentPath: string): void {
		if (!this.config.enableMonitoring) return;

		const metrics = this.metrics.get(contentPath);
		if (metrics) {
			metrics.errorCount++;
			this.addSample(metrics);
		}
	}

	getMetrics(contentPath: string): PerformanceMetrics | null {
		return this.metrics.get(contentPath) || null;
	}

	getAllMetrics(): Map<string, PerformanceMetrics> {
		return new Map(this.metrics);
	}

	getAverageMetrics(): PerformanceMetrics {
		const allMetrics = Array.from(this.metrics.values());
		if (allMetrics.length === 0) {
			return {
				loadTime: 0,
				renderTime: 0,
				cacheHitRate: 0,
				errorCount: 0,
				requestCount: 0,
			};
		}

		return {
			loadTime: allMetrics.reduce((sum, m) => sum + m.loadTime, 0) / allMetrics.length,
			renderTime: allMetrics.reduce((sum, m) => sum + m.renderTime, 0) / allMetrics.length,
			cacheHitRate: allMetrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / allMetrics.length,
			errorCount: allMetrics.reduce((sum, m) => sum + m.errorCount, 0),
			requestCount: allMetrics.reduce((sum, m) => sum + m.requestCount, 0),
		};
	}

	getSlowContent(threshold: number = 1000): Array<{ path: string; loadTime: number }> {
		const result: Array<{ path: string; loadTime: number }> = [];

		for (const [path, metrics] of this.metrics.entries()) {
			if (metrics.loadTime > threshold) {
				result.push({ path, loadTime: metrics.loadTime });
			}
		}

		return result.sort((a, b) => b.loadTime - a.loadTime);
	}

	getErrorContent(): Array<{ path: string; errorCount: number }> {
		const result: Array<{ path: string; errorCount: number }> = [];

		for (const [path, metrics] of this.metrics.entries()) {
			if (metrics.errorCount > 0) {
				result.push({ path, errorCount: metrics.errorCount });
			}
		}

		return result.sort((a, b) => b.errorCount - a.errorCount);
	}

	clearMetrics(): void {
		this.metrics.clear();
		this.samples = [];
	}

	getSamples(): PerformanceMetrics[] {
		return [...this.samples];
	}

	private addSample(metrics: PerformanceMetrics): void {
		if (Math.random() > this.config.sampleRate) return;

		this.samples.push({ ...metrics });

		if (this.samples.length > this.config.maxSamples) {
			this.samples.shift();
		}
	}
}

// Singleton instance
let monitorInstance: ContentPerformanceMonitor | null = null;

export function useContentPerformanceMonitor(
	config?: PerformanceConfig,
): ContentPerformanceMonitor {
	if (!monitorInstance) {
		monitorInstance = new ContentPerformanceMonitor(config);
	}
	return monitorInstance;
}

// Helper composable for performance monitoring
export function usePerformanceMonitor() {
	const monitor = useContentPerformanceMonitor();

	return {
		startMonitoring: () => monitor.startMonitoring(),
		stopMonitoring: () => monitor.stopMonitoring(),
		trackLoad: (contentPath: string, loadTime: number) => monitor.trackLoad(contentPath, loadTime),
		trackRender: (contentPath: string, renderTime: number) => monitor.trackRender(contentPath, renderTime),
		trackCacheHit: (contentPath: string, hit: boolean) => monitor.trackCacheHit(contentPath, hit),
		trackError: (contentPath: string) => monitor.trackError(contentPath),
		getMetrics: (contentPath: string) => monitor.getMetrics(contentPath),
		getAllMetrics: () => monitor.getAllMetrics(),
		getAverageMetrics: () => monitor.getAverageMetrics(),
		getSlowContent: (threshold?: number) => monitor.getSlowContent(threshold),
		getErrorContent: () => monitor.getErrorContent(),
		clearMetrics: () => monitor.clearMetrics(),
	};
}
