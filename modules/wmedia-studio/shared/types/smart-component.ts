import type { Element, SmartComponentElement } from "./element";

export interface SmartComponentProperty {
	id: string;
	elementId: string;
	propertyName: string;
	displayName: string;
	type: "string" | "number" | "color" | "image";
}

export interface SmartComponentMaster {
	id: string;
	name: string;
	elements: Element[];
	properties: SmartComponentProperty[];
	thumbnailUrl?: string;
}

export type SmartComponentInstance = SmartComponentElement;
