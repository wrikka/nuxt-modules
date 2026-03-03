import type { ContentItem } from "../../../shared/types";

export type HookName =
	| "beforeParse"
	| "afterParse"
	| "beforeRender"
	| "afterRender"
	| "beforeSave"
	| "afterSave"
	| "beforeDelete"
	| "afterDelete";

export type HookCallback<T = ContentItem> = (
	item: T,
	context: Record<string, any>,
) => T | Promise<T>;

export class ContentHooks {
	private hooks: Map<HookName, HookCallback<any>[]> = new Map();

	register<T = ContentItem>(name: HookName, callback: HookCallback<T>): void {
		const hooks = this.hooks.get(name) || [];
		hooks.push(callback);
		this.hooks.set(name, hooks);
	}

	async execute<T = ContentItem>(
		name: HookName,
		item: T,
		context: Record<string, any> = {},
	): Promise<T> {
		const hooks = this.hooks.get(name) || [];

		let result = item;

		for (const hook of hooks) {
			result = await hook(result, context);
		}

		return result;
	}

	pipe<T = ContentItem>(...transforms: HookCallback<T>[]): HookCallback<T> {
		return async (item: T, context: Record<string, any>) => {
			let result = item;

			for (const transform of transforms) {
				result = await transform(result, context);
			}

			return result;
		};
	}

	unregister(name: HookName, callback: HookCallback<any>): void {
		const hooks = this.hooks.get(name);
		if (!hooks) return;

		const index = hooks.indexOf(callback);
		if (index !== -1) {
			hooks.splice(index, 1);
		}
	}

	clear(name?: HookName): void {
		if (name) {
			this.hooks.delete(name);
		} else {
			this.hooks.clear();
		}
	}
}

let hooksInstance: ContentHooks | null = null;

export function getContentHooks(): ContentHooks {
	if (!hooksInstance) {
		hooksInstance = new ContentHooks();
	}
	return hooksInstance;
}
