<script setup lang="ts">
import { computed } from "vue";

interface Props {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
	quality?: number;
	format?: "webp" | "avif" | "jpeg" | "png";
	loading?: "lazy" | "eager";
	priority?: "high" | "low" | "auto";
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	alt: "",
	loading: "lazy",
	priority: "auto",
});

interface ImageConfig {
	enableLazyLoading: boolean;
	enableResponsiveImages: boolean;
	defaultQuality: number;
	formats: string[];
	sizes: number[];
}

const optimizedImage = computed(() => {
	if (process.server) {
		// Server-side: return original src
		return {
			src: props.src,
			alt: props.alt,
			loading: props.loading,
		};
	}

	// Client-side: optimize image
	// Note: This is a simplified version
	// In production, you would use the actual image optimization service
	const config: ImageConfig = {
		enableLazyLoading: props.loading === "lazy",
		enableResponsiveImages: true,
		defaultQuality: 80,
		formats: ["webp", "jpeg"],
		sizes: [640, 768, 1024, 1280, 1536],
	};

	const imageConfig = {
		width: props.width,
		height: props.height,
		quality: props.quality,
		format: props.format,
		alt: props.alt,
		priority: props.priority,
	};

	// Generate optimized image URLs
	// In production, this would use an image optimization service
	const optimizedSrc = props.src; // Placeholder - would be actual optimized URL
	const srcset = props.src
		? `${props.src} 640w, ${props.src} 768w, ${props.src} 1024w, ${props.src} 1280w, ${props.src} 1536w`
		: undefined;
	const sizes =
		"(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, (max-width: 1536px) 1536px";

	return {
		src: optimizedSrc,
		srcset,
		sizes,
		alt: props.alt,
		loading: props.loading,
		width: props.width,
		height: props.height,
		class: props.class,
	};
});
</script>

<template>
	<img
		:src="optimizedImage.src"
		:srcset="optimizedImage.srcset"
		:sizes="optimizedImage.sizes"
		:alt="optimizedImage.alt"
		:loading="optimizedImage.loading"
		:width="optimizedImage.width"
		:height="optimizedImage.height"
		:class="optimizedImage.class"
	/>
</template>
