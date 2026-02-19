<script setup lang="ts">
import { computed } from "vue";
import type { Slide } from "../types";
import { renderSlideContent } from "../utils/parser";

interface Props {
	slide: Slide;
	currentClick?: number;
}

const props = withDefaults(defineProps<Props>(), {
	currentClick: 0,
});

const layoutClass = computed(() => {
	const layout = props.slide?.frontmatter?.layout ?? "default";
	const layouts: Record<string, string> = {
		default: "p-16 flex flex-col",
		title: "p-16 flex flex-col justify-center items-center text-center",
		center: "p-16 flex flex-col justify-center items-center",
		"two-cols": "p-16 grid grid-cols-2 gap-8",
		"three-cols": "p-16 grid grid-cols-3 gap-6",
		"image-left": "p-0 grid grid-cols-2",
		"image-right": "p-0 grid grid-cols-2",
		section: "p-16 flex flex-col justify-center items-center bg-gradient-to-br from-wslide-primary to-wslide-secondary",
		quote: "p-16 flex flex-col justify-center text-2xl italic",
	};
	return layouts[layout] || layouts.default;
});

const backgroundStyle = computed(() => {
	const fm = props.slide?.frontmatter;
	if (!fm) return {};

	if (fm.backgroundImage) {
		return {
			backgroundImage: `url(${fm.backgroundImage})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
		};
	}

	if (fm.backgroundVideo) {
		return {}; // Video handled separately
	}

	if (fm.backgroundColor) {
		return { backgroundColor: fm.backgroundColor };
	}

	return {};
});

const hasVideoBackground = computed(() => {
	return !!props.slide?.frontmatter?.backgroundVideo;
});

const renderedContent = computed(async () => {
	if (!props.slide?.content) return "";
	return await renderSlideContent(props.slide.content);
});
</script>

<template>
	<div
		class="relative w-full h-full flex flex-col box-border"
		:class="layoutClass"
		:style="backgroundStyle"
	>
		<video
			v-if="hasVideoBackground"
			class="absolute inset-0 w-full h-full object-cover -z-1"
			:src="slide?.frontmatter?.backgroundVideo"
			autoplay
			muted
			loop
			playsinline
		/>

		<div class="flex-1 flex flex-col z-1">
			<div
				v-if="slide?.frontmatter?.title"
				class="text-center mb-8"
			>
				<h1 class="text-5xl font-bold m-0">{{ slide.frontmatter.title }}</h1>
				<p
					v-if="slide.frontmatter.subtitle"
					class="text-2xl opacity-80 mt-2"
				>
					{{ slide.frontmatter.subtitle }}
				</p>
			</div>

			<div
				class="flex-1 text-xl leading-relaxed prose prose-invert max-w-none"
				v-html="renderedContent"
			/>

			<div
				v-if="slide?.frontmatter?.author"
				class="flex justify-between text-sm opacity-60 pt-4"
			>
				<span>{{ slide.frontmatter.author }}</span>
				<span v-if="slide.frontmatter.date">{{ slide.frontmatter.date }}</span>
			</div>
		</div>

		<slot name="notes" />
	</div>
</template>

<style scoped>
:deep(.prose h1) {
	@apply text-4xl mb-4;
}

:deep(.prose h2) {
	@apply text-3xl mb-3;
}

:deep(.prose p) {
	@apply mb-4;
}

:deep(.prose ul),
:deep(.prose ol) {
	@apply ml-6 mb-4;
}

:deep(.prose code) {
	@apply bg-white/10 px-1 py-0.5 rounded font-mono;
}

:deep(.prose pre) {
	@apply bg-black/30 p-4 rounded-lg overflow-x-auto;
}
</style>
