export interface ComponentItem {
	id: string;
	name: string;
	category: string;
	preview: string;
	tags: string[];
	properties: Record<string, unknown>;
}

export interface ComponentCategory {
	id: string;
	name: string;
	icon: string;
}
