import { createHash } from "crypto";

export interface ImageOptimizationOptions {
	width?: number;
	height?: number;
	quality?: number;
	format?: "webp" | "avif" | "jpeg" | "png";
}

export interface OptimizedImageResult {
	src: string;
	width: number;
	height: number;
	format: string;
	size: number;
}

export class ImageOptimizer {
	private cache: Map<string, OptimizedImageResult> = new Map();

	async optimize(
		imageUrl: string,
		options: ImageOptimizationOptions = {},
	): Promise<OptimizedImageResult> {
		const cacheKey = this.getCacheKey(imageUrl, options);

		// Check cache first
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached;
		}

		// Simulate image optimization (in real implementation, use sharp or similar)
		const result: OptimizedImageResult = {
			src: this.generateOptimizedUrl(imageUrl, options),
			width: options.width || 800,
			height: options.height || 600,
			format: options.format || "webp",
			size: this.estimateSize(options.width || 800, options.height || 600, options.quality || 80),
		};

		// Cache the result
		this.cache.set(cacheKey, result);

		return result;
	}

	private getCacheKey(imageUrl: string, options: ImageOptimizationOptions): string {
		const hash = createHash("md5")
			.update(imageUrl)
			.update(JSON.stringify(options))
			.digest("hex");
		return `img_${hash}`;
	}

	private generateOptimizedUrl(imageUrl: string, options: ImageOptimizationOptions): string {
		const params = new URLSearchParams();

		if (options.width) params.set("w", options.width.toString());
		if (options.height) params.set("h", options.height.toString());
		if (options.quality) params.set("q", options.quality.toString());
		if (options.format) params.set("f", options.format);

		const queryString = params.toString();
		return queryString ? `${imageUrl}?${queryString}` : imageUrl;
	}

	private estimateSize(width: number, height: number, quality: number): number {
		// Estimate file size based on dimensions and quality
		const pixels = width * height;
		const baseSize = pixels * 0.5; // Base size in bytes (rough estimate)
		const qualityFactor = quality / 100;
		return Math.floor(baseSize * qualityFactor);
	}

	generateSrcSet(imageUrl: string, sizes: number[] = [320, 640, 960, 1280, 1920]): string {
		return sizes
			.map((size) => {
				const optimized = this.generateOptimizedUrl(imageUrl, { width: size });
				return `${optimized} ${size}w`;
			})
			.join(", ");
	}

	generateSizes(): string {
		return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
	}

	clearCache() {
		this.cache.clear();
	}
}

let optimizerInstance: ImageOptimizer | null = null;

export function getImageOptimizer(): ImageOptimizer {
	if (!optimizerInstance) {
		optimizerInstance = new ImageOptimizer();
	}
	return optimizerInstance;
}
