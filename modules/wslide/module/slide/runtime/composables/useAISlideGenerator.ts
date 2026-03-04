import { ref, computed } from "vue";
import { useFetch } from "#app";
import type { Slide, SlideFrontmatter } from "#wslide/types";

export interface AISlideOptions {
	topic: string;
	slideCount?: number;
	tone?: "professional" | "casual" | "educational" | "fun";
	language?: string;
	includeImages?: boolean;
}

export interface GeneratedSlide {
	title: string;
	content: string;
	bullets?: string[];
	layout?: string;
}

export function useAISlideGenerator() {
	const isGenerating = ref(false);
	const generatedSlides = ref<GeneratedSlide[]>([]);
	const error = ref<string | null>(null);
	const progress = ref(0);

	const canGenerate = computed(() => {
		return typeof window !== "undefined" && "ai" in window;
	});

	async function generateSlides(options: AISlideOptions): Promise<GeneratedSlide[]> {
		isGenerating.value = true;
		error.value = null;
		progress.value = 0;

		try {
			const prompt = buildPrompt(options);
			const slides = await generateWithAI(prompt, options);
			generatedSlides.value = slides;
			return slides;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Unknown error";
			return [];
		} finally {
			isGenerating.value = false;
		}
	}

	function buildPrompt(options: AISlideOptions): string {
		return `Create a presentation about "${options.topic}" with ${options.slideCount || 5} slides.
Tone: ${options.tone || "professional"}
Language: ${options.language || "English"}

For each slide, provide:
1. Title
2. Content (markdown format)
3. Bullet points (if applicable)
4. Suggested layout (title, two-cols, center, etc.)

Format as JSON array.`;
	}

	async function generateWithAI(
		prompt: string,
		options: AISlideOptions,
	): Promise<GeneratedSlide[]> {
		const ai = (window as Window & { ai?: { createTextSession: () => Promise<{ prompt: (p: string) => Promise<string> }> } }).ai;
		
		if (!ai) {
			throw new Error("AI API not available. Use Chrome with AI features enabled.");
		}

		const session = await ai.createTextSession();
		const response = await session.prompt(prompt);
		
		updateProgress(50);
		
		const slides = parseAIResponse(response);
		
		updateProgress(100);
		
		return enhanceSlides(slides, options);
	}

	function parseAIResponse(response: string): GeneratedSlide[] {
		try {
			const cleaned = response.replace(/```json\n?|```\n?/g, "").trim();
			return JSON.parse(cleaned);
		} catch {
			return parseMarkdownResponse(response);
		}
	}

	function parseMarkdownResponse(response: string): GeneratedSlide[] {
		const slides: GeneratedSlide[] = [];
		const sections = response.split(/\n?#{2,3}\s+/).filter(Boolean);
		
		for (const section of sections) {
			const lines = section.split("\n").filter(Boolean);
			if (lines.length === 0) continue;
			
			const title = lines[0].replace(/^#+\s*/, "").trim();
			const content = lines.slice(1).join("\n").trim();
			const bullets = lines
				.filter(line => line.trim().startsWith("- ") || line.trim().startsWith("* "))
				.map(line => line.replace(/^[-*]\s*/, "").trim());
			
			slides.push({
				title,
				content,
				bullets,
				layout: bullets.length > 0 ? "two-cols" : "default",
			});
		}
		
		return slides;
	}

	function enhanceSlides(slides: GeneratedSlide[], options: AISlideOptions): GeneratedSlide[] {
		return slides.map((slide, index) => ({
			...slide,
			layout: slide.layout || getLayoutForIndex(index, slides.length),
		}));
	}

	function getLayoutForIndex(index: number, total: number): string {
		if (index === 0) return "title";
		if (index === total - 1) return "center";
		return "default";
	}

	function convertToSlideDeck(slides: GeneratedSlide[]): Slide[] {
		return slides.map((slide, index) => ({
			id: `ai-slide-${index}`,
			index,
			content: generateSlideContent(slide),
			frontmatter: {
				title: slide.title,
				layout: slide.layout,
			} as SlideFrontmatter,
			clicks: 0,
			maxClicks: slide.bullets?.length || 0,
		}));
	}

	function generateSlideContent(slide: GeneratedSlide): string {
		const bullets = slide.bullets
			?.map(b => `- ${b}`)
			.join("\n") || "";
		
		return `# ${slide.title}\n\n${slide.content}\n\n${bullets}`.trim();
	}

	function updateProgress(value: number) {
		progress.value = value;
	}

	function reset() {
		isGenerating.value = false;
		generatedSlides.value = [];
		error.value = null;
		progress.value = 0;
	}

	return {
		isGenerating: readonly(isGenerating),
		generatedSlides: readonly(generatedSlides),
		error: readonly(error),
		progress: readonly(progress),
		canGenerate,
		generateSlides,
		convertToSlideDeck,
		reset,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
