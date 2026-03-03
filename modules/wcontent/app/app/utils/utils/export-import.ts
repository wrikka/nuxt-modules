import type { ContentItem } from "../../../shared/types";

export interface ExportOptions {
	format?: "json" | "markdown" | "yaml";
	includeMetadata?: boolean;
	includeBody?: boolean;
}

export interface ImportResult {
	imported: number;
	failed: number;
	errors: string[];
}

export class ContentExporter {
	export(items: ContentItem[], options: ExportOptions = {}): string {
		const { format = "json", includeMetadata = true, includeBody = true } = options;

		switch (format) {
			case "json":
				return this.exportJSON(items, includeMetadata, includeBody);
			case "markdown":
				return this.exportMarkdown(items, includeMetadata, includeBody);
			case "yaml":
				return this.exportYAML(items, includeMetadata, includeBody);
			default:
				return this.exportJSON(items, includeMetadata, includeBody);
		}
	}

	private exportJSON(items: ContentItem[], includeMetadata: boolean, includeBody: boolean): string {
		const exported = items.map((item) => {
			const exported: Record<string, any> = {};

			if (includeMetadata) {
				exported.__path = item.__path;
				exported._dir = item._dir;
				exported._partial = item._partial;
				exported.updatedAt = item.updatedAt;
			}

			if (includeBody && item.body) {
				exported.body = item.body;
			}

			// Add all other fields
			for (const [key, value] of Object.entries(item)) {
				if (!key.startsWith("_")) {
					exported[key] = value;
				}
			}

			return exported;
		});

		return JSON.stringify(exported, null, 2);
	}

	private exportMarkdown(items: ContentItem[], includeMetadata: boolean, includeBody: boolean): string {
		return items
			.map((item) => {
				let md = "";

				// Add frontmatter
				if (includeMetadata) {
					md += "---\n";
					md += `title: ${item.title || ""}\n`;
					md += `date: ${item.date || ""}\n`;
					md += `_path: ${item.__path}\n`;
					md += "---\n\n";
				}

				// Add body
				if (includeBody && item.body?.content) {
					md += item.body.content;
				}

				return md;
			})
			.join("\n---\n");
	}

	private exportYAML(items: ContentItem[], includeMetadata: boolean, includeBody: boolean): string {
		// Simple YAML export (in real implementation, use a YAML library)
		return items
			.map((item) => {
				let yaml = "";

				if (includeMetadata) {
					yaml += `title: ${item.title || ""}\n`;
					yaml += `date: ${item.date || ""}\n`;
					yaml += `_path: ${item.__path}\n`;
				}

				if (includeBody && item.body?.content) {
					yaml += `body: |\n${item.body.content.split("\n").map((line: string) => `  ${line}`).join("\n")}`;
				}

				return yaml;
			})
			.join("\n---\n");
	}
}

export class ContentImporter {
	import(data: string, format: "json" | "markdown" | "yaml"): ImportResult {
		const result: ImportResult = {
			imported: 0,
			failed: 0,
			errors: [],
		};

		try {
			let items: ContentItem[];

			switch (format) {
				case "json":
					items = this.importJSON(data);
					break;
				case "markdown":
				case "yaml":
				default:
					result.errors.push(`Format ${format} not supported for import`);
					return result;
			}

			result.imported = items.length;
		} catch (error) {
			result.failed = 1;
			result.errors.push(`Import failed: ${String(error)}`);
		}

		return result;
	}

	private importJSON(data: string): ContentItem[] {
		const items = JSON.parse(data);

		if (!Array.isArray(items)) {
			throw new Error("Invalid JSON format: expected array");
		}

		return items;
	}
}

let exporterInstance: ContentExporter | null = null;
let importerInstance: ContentImporter | null = null;

export function getContentExporter(): ContentExporter {
	if (!exporterInstance) {
		exporterInstance = new ContentExporter();
	}
	return exporterInstance;
}

export function getContentImporter(): ContentImporter {
	if (!importerInstance) {
		importerInstance = new ContentImporter();
	}
	return importerInstance;
}
