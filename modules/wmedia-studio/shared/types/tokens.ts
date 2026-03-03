export interface DesignToken {
	id: string;
	name: string;
	type: "color" | "typography" | "spacing" | "shadow" | "border" | "radius";
	value: string;
	category: string;
	description?: string;
}

export interface TokenCategory {
	id: string;
	name: string;
	icon: string;
	tokens: DesignToken[];
}
