// Stub implementations - @wdocs/content not available in workspace
class MarkdownCache {
	private cache = new Map<string, unknown>();
	get(key: string) { return this.cache.get(key); }
	set(key: string, value: unknown) { this.cache.set(key, value); }
}

class MarkdownPipeline {
	private transformers: Array<unknown> = [];
	constructor(private _cache: MarkdownCache) { }
	addTransformers(transformers: Array<unknown>) {
		this.transformers.push(...transformers);
	}
	async process(content: string): Promise<{ html: string; toc: Array<{ level: number; text: string; id: string }> }> {
		return { html: content, toc: [] };
	}
}

class ContentManager {
	constructor(private _config: unknown, private _pipeline: MarkdownPipeline) { }
	async parseMarkdown(content: string): Promise<{ html: string; toc: Array<{ level: number; text: string; id: string }> }> {
		return this._pipeline.process(content);
	}
}

// Stub transformers
const createAnchorTransformer = () => ({ name: 'anchor' });
const createCodeCopyTransformer = () => ({ name: 'code-copy' });
const createContainerTransformer = (type: string) => ({ name: 'container', type });
const createHighlighterTransformer = (_highlighter: unknown) => ({ name: 'highlighter' });
const createIncludeTransformer = (_cwd: string) => ({ name: 'include' });
const createMermaidTransformer = () => ({ name: 'mermaid' });

const cache = new MarkdownCache();
const pipeline = new MarkdownPipeline(cache);

// Initialize pipeline with transformers
async function initializePipeline() {
	// Stub highlighter
	const highlighter = { name: 'stub-highlighter' };

	pipeline.addTransformers([
		createHighlighterTransformer(highlighter),
		createAnchorTransformer(),
		createContainerTransformer('info'),
		createContainerTransformer('tip'),
		createContainerTransformer('warning'),
		createIncludeTransformer(process.cwd()),
		createMermaidTransformer(),
		createCodeCopyTransformer(),
	]);
}

initializePipeline();

export const contentManager = new ContentManager(undefined, pipeline);
