/**
 * Union-Find (Disjoint Set) data structure with path compression and union by rank
 */
export class UnionFind<T> {
	private parent = new Map<T, T>();
	private rank = new Map<T, number>();
	private size = new Map<T, number>();

	constructor(elements: T[] = []) {
		for (const element of elements) {
			this.makeSet(element);
		}
	}

	/**
	 * Creates a new set containing the element
	 */
	makeSet(element: T): void {
		if (!this.parent.has(element)) {
			this.parent.set(element, element);
			this.rank.set(element, 0);
			this.size.set(element, 1);
		}
	}

	/**
	 * Finds the representative (root) of the set containing the element
	 * Uses path compression for optimization
	 */
	find(element: T): T {
		if (!this.parent.has(element)) {
			throw new Error(`Element ${element} not found in UnionFind`);
		}

		if (this.parent.get(element) !== element) {
			// Path compression
			this.parent.set(element, this.find(this.parent.get(element)!));
		}

		return this.parent.get(element)!;
	}

	/**
	 * Unions two sets containing the given elements
	 * Uses union by rank for optimization
	 * Returns true if union was performed, false if elements were already in same set
	 */
	union(element1: T, element2: T): boolean {
		const root1 = this.find(element1);
		const root2 = this.find(element2);

		if (root1 === root2) {
			return false; // Already in same set
		}

		// Union by rank
		if (this.rank.get(root1)! < this.rank.get(root2)!) {
			this.parent.set(root1, root2);
			this.size.set(root2, this.size.get(root2)! + this.size.get(root1)!);
		} else if (this.rank.get(root1)! > this.rank.get(root2)!) {
			this.parent.set(root2, root1);
			this.size.set(root1, this.size.get(root1)! + this.size.get(root2)!);
		} else {
			this.parent.set(root2, root1);
			this.rank.set(root1, this.rank.get(root1)! + 1);
			this.size.set(root1, this.size.get(root1)! + this.size.get(root2)!);
		}

		return true;
	}

	/**
	 * Checks if two elements are in the same set
	 */
	connected(element1: T, element2: T): boolean {
		return this.find(element1) === this.find(element2);
	}

	/**
	 * Gets the size of the set containing the element
	 */
	getSetSize(element: T): number {
		const root = this.find(element);
		return this.size.get(root)!;
	}

	/**
	 * Gets all elements in the set containing the element
	 */
	getSetElements(element: T): T[] {
		const root = this.find(element);
		const elements: T[] = [];

		for (const [elem, elemRoot] of this.parent) {
			if (elemRoot === root) {
				elements.push(elem);
			}
		}

		return elements;
	}

	/**
	 * Gets all unique sets (represented by their roots)
	 */
	getAllSets(): T[] {
		const sets = new Set<T>();

		for (const element of this.parent.keys()) {
			sets.add(this.find(element));
		}

		return Array.from(sets);
	}

	/**
	 * Gets the number of distinct sets
	 */
	getSetCount(): number {
		return this.getAllSets().length;
	}
}

/**
 * Creates a UnionFind instance from an array of elements
 */
export function createUnionFind<T>(elements: T[]): UnionFind<T> {
	return new UnionFind(elements);
}
