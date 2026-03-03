import type { ContentItem } from "../../../shared/types";

export interface ContentRelation {
	type: "one-to-one" | "one-to-many" | "many-to-many";
	targetCollection: string;
	targetField: string;
	inverseField?: string;
}

export interface ContentRelationshipsConfig {
	[collection: string]: {
		[relationName: string]: ContentRelation;
	};
}

export class ContentRelationships {
	private relationships: ContentRelationshipsConfig;

	constructor(config?: ContentRelationshipsConfig) {
		this.relationships = config || {};
	}

	defineRelationship(
		collection: string,
		name: string,
		relation: ContentRelation,
	): void {
		if (!this.relationships[collection]) {
			this.relationships[collection] = {};
		}
		this.relationships[collection][name] = relation;
	}

	getRelated(
		item: ContentItem,
		relationName: string,
		allItems: ContentItem[],
	): ContentItem[] {
		const collection = item._dir;
		const relation = this.relationships[collection]?.[relationName];

		if (!relation) return [];

		const relatedItems: ContentItem[] = [];

		for (const targetItem of allItems) {
			if (targetItem._dir !== relation.targetCollection) continue;

			if (relation.type === "one-to-one") {
				const sourceValue = item[relation.targetField];
				const targetValue = targetItem[relation.inverseField || relation.targetField];

				if (sourceValue === targetValue) {
					relatedItems.push(targetItem);
				}
			} else if (relation.type === "one-to-many") {
				const sourceValue = item[relation.targetField];
				const targetValue = targetItem[relation.inverseField || relation.targetField];

				if (sourceValue === targetValue) {
					relatedItems.push(targetItem);
				}
			} else if (relation.type === "many-to-many") {
				const sourceValue = item[relation.targetField];
				const targetValue = targetItem[relation.inverseField || relation.targetField];

				if (
					Array.isArray(sourceValue)
					&& Array.isArray(targetValue)
					&& sourceValue.some((v) => targetValue.includes(v))
				) {
					relatedItems.push(targetItem);
				}
			}
		}

		return relatedItems;
	}

	getOne(
		item: ContentItem,
		relationName: string,
		allItems: ContentItem[],
	): ContentItem | null {
		const related = this.getRelated(item, relationName, allItems);
		return related[0] || null;
	}

	getMany(
		item: ContentItem,
		relationName: string,
		allItems: ContentItem[],
	): ContentItem[] {
		return this.getRelated(item, relationName, allItems);
	}

	getConfig(): ContentRelationshipsConfig {
		return this.relationships;
	}
}

// Singleton instance
let relationshipsInstance: ContentRelationships | null = null;

export function useContentRelationships(
	config?: ContentRelationshipsConfig,
): ContentRelationships {
	if (!relationshipsInstance) {
		relationshipsInstance = new ContentRelationships(config);
	}
	return relationshipsInstance;
}

// Helper composable for querying related content
export function useRelatedContent(item: ContentItem, allItems: ContentItem[]) {
	const relationships = useContentRelationships();

	return {
		getOne: (relationName: string) => relationships.getOne(item, relationName, allItems),
		getMany: (relationName: string) => relationships.getMany(item, relationName, allItems),
	};
}
