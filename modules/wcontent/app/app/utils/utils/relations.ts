import type { ContentItem } from "../../../shared/types";

export interface Relation {
	type: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
	field: string;
	foreignKey?: string;
	referencedField?: string;
}

export interface Relations {
	[field: string]: Relation;
}

export class ContentRelations {
	private relations: Map<string, Relations> = new Map();

	defineRelations(collection: string, relations: Relations) {
		this.relations.set(collection, relations);
	}

	getRelated<T = ContentItem>(
		item: ContentItem,
		relationType: string,
		items: T[],
	): T[] {
		const collection = item._dir || "default";
		const relations = this.relations.get(collection);

		if (!relations) {
			return [];
		}

		const relation = relations[relationType];
		if (!relation) {
			return [];
		}

		switch (relation.type) {
			case "one-to-one":
				return this.getOneToOne(item, relation, items);
			case "one-to-many":
				return this.getOneToMany(item, relation, items);
			case "many-to-one":
				return this.getManyToOne(item, relation, items);
			case "many-to-many":
				return this.getManyToMany(item, relation, items);
			default:
				return [];
		}
	}

	private getOneToOne<T = ContentItem>(
		item: ContentItem,
		relation: Relation,
		items: T[],
	): T[] {
		const foreignKey = relation.foreignKey || relation.field;
		const foreignValue = (item as any)[foreignKey];

		if (!foreignValue) {
			return [];
		}

		const related = items.find((relatedItem) => {
			const referencedField = relation.referencedField || "id";
			return (relatedItem as any)[referencedField] === foreignValue;
		});

		return related ? [related] : [];
	}

	private getOneToMany<T = ContentItem>(
		item: ContentItem,
		relation: Relation,
		items: T[],
	): T[] {
		const foreignKey = relation.foreignKey || `${item._dir}_id`;
		const foreignValue = (item as any).id || item.__path;

		if (!foreignValue) {
			return [];
		}

		return items.filter((relatedItem) => {
			return (relatedItem as any)[foreignKey] === foreignValue;
		});
	}

	private getManyToOne<T = ContentItem>(
		item: ContentItem,
		relation: Relation,
		items: T[],
	): T[] {
		const foreignKey = relation.foreignKey || relation.field;
		const foreignValue = (item as any)[foreignKey];

		if (!foreignValue) {
			return [];
		}

		const related = items.find((relatedItem) => {
			const referencedField = relation.referencedField || "id";
			return (relatedItem as any)[referencedField] === foreignValue;
		});

		return related ? [related] : [];
	}

	private getManyToMany<T = ContentItem>(
		item: ContentItem,
		relation: Relation,
		items: T[],
	): T[] {
		const foreignKey = relation.foreignKey || `${item._dir}_ids`;
		const foreignValues = (item as any)[foreignKey];

		if (!Array.isArray(foreignValues) || foreignValues.length === 0) {
			return [];
		}

		const referencedField = relation.referencedField || "id";

		return items.filter((relatedItem) => {
			return foreignValues.includes((relatedItem as any)[referencedField]);
		});
	}

	getRelations(collection: string): Relations | undefined {
		return this.relations.get(collection);
	}

	hasRelation(collection: string, relationType: string): boolean {
		const relations = this.relations.get(collection);
		if (!relations) return false;

		return !!relations[relationType];
	}
}

let relationsInstance: ContentRelations | null = null;

export function getContentRelations(): ContentRelations {
	if (!relationsInstance) {
		relationsInstance = new ContentRelations();
	}
	return relationsInstance;
}
