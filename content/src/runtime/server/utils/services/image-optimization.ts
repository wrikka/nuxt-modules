export interface ImageConfig {
	enableLazyLoading: boolean;
	enableResponsiveImages: boolean;
	defaultQuality: number;
	formats: ("webp" | "avif" | "jpeg" | "png")[];
	sizes: number[];
}

export interface OptimizedImage {
	__src: string;
	__srcset?: string;
	sizes?: string;
	width: number;
	height: number;
	alt?: string;
	loading?: "lazy" | "eager";
}

export class ImageOptimizer {
	private config: ImageConfig;

	constructor(config?: ImageConfig) {
		this.config = config || {
			enableLazyLoading: true,
			enableResponsiveImages: true,
			defaultQuality: 80,
			formats: ["webp", "jpeg"],
			sizes: [640, 768, 1024, 1280, 1536],
		};
	}

	shouldLazyLoad(priority: "high" | "low" | "auto" = "auto"): boolean {
		if (!this.config.enableLazyLoading) return false;
		return priority !== "high";
	}

	generate__srcset(
		__src: string,
		widths?: number[],
		formats?: ("webp" | "avif" | "jpeg" | "png")[],
	): string {
		const sizes = widths || this.config.sizes;
		const fmts = formats || this.config.formats;

		const __srcsetEntries: string[] = [];

		for (const format of fmts) {
			for (const width of sizes) {
				__srcsetEntries.push(`${this.buildImageURL(__src, width, format)} ${width}w`);
			}
		}

		return __srcsetEntries.join(", ");
	}

	generateSizes(breakpoints?: number[]): string {
		const bp = breakpoints || [640, 768, 1024, 1280, 1536];

		return bp
			.map((size, index) => {
				if (index === bp.length - 1) {
					return `${size}px`;
				}
				return `(max-width: ${size}px) ${size}px`;
			})
			.join(", ");
	}

	optimizeImage(
		__src: string,
		options: {
			width?: number;
			height?: number;
			quality?: number;
			format?: "webp" | "avif" | "jpeg" | "png";
			alt?: string;
			priority?: "high" | "low" | "auto";
		} = {},
	): OptimizedImage {
		const {
			width = 800,
			height = 600,
			quality = this.config.defaultQuality,
			format = this.config.formats[0],
			alt,
			priority = "auto",
		} = options;

		const optimized__src = this.buildImageURL(__src, width, format, quality);

		const result: OptimizedImage = {
			__src: optimized__src,
			width,
			height,
			alt,
			loading: this.shouldLazyLoad(priority) ? "lazy" : "eager",
		};

		if (this.config.enableResponsiveImages) {
			result.__srcset = this.generate__srcset(__src, undefined, [format]);
			result.sizes = this.generateSizes();
		}

		return result;
	}

	private buildImageURL(
		__src: string,
		width?: number,
		format?: string,
		quality?: number,
	): string {
		// In a real implementation, this would use an image optimization service
		// like Cloudinary, ImageKit, or a custom optimization endpoint
		// Use a default origin for server-side
		const origin = "https://example.com";
		const url = new URL(__src, origin);
		if (width) url.searchParams.set("width", width.toString());
		if (format) url.searchParams.set("format", format);
		if (quality) url.searchParams.set("quality", quality.toString());
		return url.toString();
	}

	getPlaceholder(__src: string, width: number = 10, _height: number = 10): string {
		// Generate a tiny placeholder image for LQIP (Low Quality Image Placeholder)
		return this.buildImageURL(__src, width, "jpeg", 10);
	}

	preloadImage(__src: string): void {
		// This method is only useful in browser context
		// No-op in server environment
		return;
	}

	getConfig(): ImageConfig {
		return this.config;
	}
}

// Singleton instance
let optimizerInstance: ImageOptimizer | null = null;

export function useImageOptimizer(config?: ImageConfig): ImageOptimizer {
	if (!optimizerInstance) {
		optimizerInstance = new ImageOptimizer(config);
	}
	return optimizerInstance;
}

// Helper composable for image optimization
export function useOptimizedImage() {
	const optimizer = useImageOptimizer();

	return {
		optimizeImage: (
			__src: string,
			options?: {
				width?: number;
				height?: number;
				quality?: number;
				format?: "webp" | "avif" | "jpeg" | "png";
				alt?: string;
				priority?: "high" | "low" | "auto";
			},
		) => optimizer.optimizeImage(__src, options),
		generate__srcset: (__src: string, widths?: number[], formats?: ("webp" | "avif" | "jpeg" | "png")[]) =>
			optimizer.generate__srcset(__src, widths, formats),
		generateSizes: (breakpoints?: number[]) => optimizer.generateSizes(breakpoints),
		getPlaceholder: (__src: string, width?: number, height?: number) => optimizer.getPlaceholder(__src, width, height),
		preloadImage: (__src: string) => optimizer.preloadImage(__src),
	};
}
