import matter from "gray-matter";
import { marked } from "marked";
import type { Slide, SlideDeck, SlideFrontmatter } from "../types";

const SLIDE_SEPARATOR = /^---\s*$/m;

export function parseSlideDeck(content: string): SlideDeck {
	const slideContents = content.split(SLIDE_SEPARATOR);
	const slides: Slide[] = [];

	for (let i = 0; i < slideContents.length; i++) {
		const slideContent = (slideContents[i] || "").trim();
		if (!slideContent) continue;

		const parsed = matter(slideContent);
		const maxClicks = countClicks(parsed.content);

		slides.push({
			id: `slide-${i}`,
			index: i,
			content: parsed.content,
			frontmatter: parsed.data as SlideFrontmatter,
			clicks: 0,
			maxClicks,
		});
	}

	return {
		slides,
		title: slides[0]?.frontmatter?.title,
		author: slides[0]?.frontmatter?.author,
		date: slides[0]?.frontmatter?.date,
	};
}

export function parseFrontmatter(content: string): {
	frontmatter: SlideFrontmatter;
	body: string;
} {
	const parsed = matter(content);
	return {
		frontmatter: parsed.data as SlideFrontmatter,
		body: parsed.content,
	};
}

export async function renderSlideContent(content: string): Promise<string> {
	return await marked(content, {
		gfm: true,
		breaks: true,
	});
}

function countClicks(content: string): number {
	// Count clickable elements (v-clicks, animations, etc.)
	const clickRegex = /v-click|v-after|v-click-hide|v-motion/g;
	const matches = content.match(clickRegex);
	return matches?.length ?? 0;
}

export function extractNotes(frontmatter: SlideFrontmatter): string {
	return frontmatter.notes ?? "";
}

export function getLayoutClass(layout: string | undefined): string {
	const validLayouts = [
		"default",
		"title",
		"two-cols",
		"three-cols",
		"image-left",
		"image-right",
		"center",
		"quote",
		"section",
	];

	return validLayouts.includes(layout ?? "")
		? `layout-${layout}`
		: "layout-default";
}
