export interface Template {
	id: string;
	name: string;
	description?: string;
	thumbnail: string;
	category: TemplateCategory;
	tags: string[];
	elements: string[];
	width: number;
	height: number;
	backgroundColor: string;
	isPremium: boolean;
	isCustom?: boolean;
	usageCount: number;
	rating: number;
	createdAt: Date;
	updatedAt: Date;
	createdBy?: string;
	reason?: string;
}

export type TemplateCategory =
	| "social-media"
	| "presentation"
	| "poster"
	| "flyer"
	| "business-card"
	| "resume"
	| "infographic"
	| "menu"
	| "invitation"
	| "banner"
	| "logo"
	| "other";

export interface Asset {
	id: string;
	name: string;
	type: AssetType;
	url: string;
	thumbnail?: string;
	category: AssetCategory;
	tags: string[];
	isPremium: boolean;
	createdAt: Date;
}

export type AssetType = "image" | "video" | "audio" | "icon" | "font" | "shape";

export type AssetCategory =
	| "photos"
	| "illustrations"
	| "videos"
	| "audio"
	| "icons"
	| "fonts"
	| "shapes"
	| "patterns"
	| "gradients";

export interface BrandKit {
	id: string;
	name: string;
	colors: BrandColor[];
	fonts: BrandFont[];
	logos: BrandLogo[];
	templates: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface BrandColor {
	id: string;
	name: string;
	hex: string;
	isPrimary: boolean;
}

export interface BrandFont {
	id: string;
	name: string;
	family: string;
	weights: number[];
	isPrimary: boolean;
}

export interface BrandLogo {
	id: string;
	name: string;
	url: string;
	thumbnail?: string;
	isPrimary: boolean;
}
