import type { ContentItem } from "../../../shared/types";

export interface MiddlewareContext {
	item: ContentItem;
	stage: "parse" | "validate" | "transform" | "render" | "save";
	metadata?: Record<string, any>;
}

export type MiddlewareFunction<_T = ContentItem> = (
	context: MiddlewareContext,
	next: () => Promise<void>,
) => Promise<void>;

export class ContentMiddleware {
	private middlewares: MiddlewareFunction[] = [];

	use(middleware: MiddlewareFunction): void {
		this.middlewares.push(middleware);
	}

	async execute(context: MiddlewareContext): Promise<void> {
		let index = 0;

		const next = async () => {
			const middleware = this.middlewares[index++];
			if (middleware) {
				await middleware(context, next);
			}
		};

		await next();
	}

	pipe(...middlewares: MiddlewareFunction[]): MiddlewareFunction {
		return async (context: MiddlewareContext, _next: () => Promise<void>) => {
			let index = 0;

			const nextHandler = async () => {
				const middleware = middlewares[index++];
				if (middleware) {
					await middleware(context, nextHandler);
				}
			};

			return nextHandler();
		};
	}

	compose(...middlewares: MiddlewareFunction[]): MiddlewareFunction {
		return this.pipe(...middlewares);
	}

	clear(): void {
		this.middlewares = [];
	}
}

let middlewareInstance: ContentMiddleware | null = null;

export function getContentMiddleware(): ContentMiddleware {
	if (!middlewareInstance) {
		middlewareInstance = new ContentMiddleware();
	}
	return middlewareInstance;
}
