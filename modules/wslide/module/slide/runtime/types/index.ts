export interface SlideFrontmatter {
	title?: string;
	subtitle?: string;
	author?: string;
	date?: string;
	layout?: string;
	transition?: string;
	class?: string;
	background?: string;
	backgroundImage?: string;
	backgroundVideo?: string;
	backgroundColor?: string;
	notes?: string;
	disableAnimation?: boolean;
	hideInToc?: boolean;
	clicks?: number;
}

export interface Slide {
	id: string;
	index: number;
	content: string;
	frontmatter: SlideFrontmatter;
	clicks: number;
	maxClicks: number;
}

export interface SlideDeck {
	slides: Slide[];
	title?: string;
	author?: string;
	date?: string;
	theme?: string;
	globalTransition?: string;
}

export interface SlideTransition {
	name: string;
	enterClass?: string;
	leaveClass?: string;
	duration?: number;
}

export interface SlideControls {
	slideNumbers: boolean;
	progressBar: boolean;
	navigation: boolean;
	presenterNotes: boolean;
}

export interface SlideAnimations {
	enabled: boolean;
	duration: number;
	easing: string;
}

export interface WSlideConfig {
	srcDir: string;
	theme: string;
	transition: string;
	presenterMode: boolean;
	exportEnabled: boolean;
	animations: SlideAnimations;
	controls: SlideControls;
}

export interface PresenterState {
	currentSlide: number;
	currentClick: number;
	totalSlides: number;
	isPresenter: boolean;
	sessionId?: string;
}

export type SlideLayout =
	| "default"
	| "title"
	| "two-cols"
	| "three-cols"
	| "image-left"
	| "image-right"
	| "center"
	| "quote"
	| "section";
