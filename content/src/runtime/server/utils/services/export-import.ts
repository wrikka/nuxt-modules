import type { ContentItem } from "../../../shared/types";

export interface ExportConfig {
	format: "json" | "markdown" | "csv";
	includeMetadata?: boolean;
	includeBody?: boolean;
}

export interface ImportConfig {
	format: "json" | "markdown" | "csv";
	overwrite?: boolean;
	validate?: boolean;
}

export class ContentExportImport {
	async exportContent(
		content: ContentItem[],
		config: ExportConfig,
	): Promise<string> {
		switch (config.format) {
			case "json":
				return this.exportJSON(content, config);
			case "markdown":
				return this.exportMarkdown(content, config);
			case "csv":
				return this.exportCSV(content, config);
			default: {
				const _exhaustiveCheck: never = config.format;
				throw new Error(`Unsupported format: ${String(_exhaustiveCheck)}`);
			}
		}
	}

	private exportJSON(content: ContentItem[], config: ExportConfig): string {
		const data = content.map((item) => {
			const result: Record<string, any> = {
				_path: item._path,
				_dir: item._dir,
				_partial: item._partial,
			};

			if (config.includeMetadata) {
				result.title = item.title;
				result.description = item.description;
				result.order = item.order;
				result.icon = item.icon;
				result.tags = item.tags;
				result.updatedAt = item.updatedAt;
				result.category = item.category;
			}

			if (config.includeBody && item.body) {
				result.body = item.body;
			}

			return result;
		});

		return JSON.stringify(data, null, 2);
	}

	private exportMarkdown(content: ContentItem[], config: ExportConfig): string {
		return content
			.map((item) => {
				let markdown = `# ${item.title || "Untitled"}\n\n`;

				if (config.includeMetadata) {
					if (item.description) markdown += `Description: ${item.description}\n\n`;
					if (item.tags && item.tags.length > 0) {
						markdown += `Tags: ${item.tags.join(", ")}\n\n`;
					}
					if (item.updatedAt) markdown += `Updated: ${item.updatedAt}\n\n`;
				}

				if (config.includeBody && item.body) {
					markdown += `${item.body}\n`;
				}

				return markdown;
			})
			.join("\n---\n\n");
	}

	private exportCSV(content: ContentItem[], config: ExportConfig): string {
		const headers = ["path", "directory", "title", "description"];
		if (config.includeBody) headers.push("body");

		const rows = content.map((item) => {
			const row = [
				item._path,
				item._dir,
				item.title || "",
				item.description || "",
			];

			if (config.includeBody) {
				row.push(
					typeof item.body === "string"
						? item.body.replace(/"/g, "\"\"")
						: JSON.stringify(item.body),
				);
			}

			return row;
		});

		return [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
	}

	async importContent(
		data: string,
		config: ImportConfig,
	): Promise<ContentItem[]> {
		switch (config.format) {
			case "json":
				return this.importJSON(data, config);
			case "markdown":
				return this.importMarkdown(data, config);
			case "csv":
				return this.importCSV(data, config);
			default: {
				const _exhaustiveCheck: never = config.format;
				throw new Error(`Unsupported format: ${String(_exhaustiveCheck)}`);
			}
		}
	}

	private importJSON(data: string, config: ImportConfig): ContentItem[] {
		const items = JSON.parse(data);

		if (config.validate) {
			this.validateItems(items);
		}

		return items;
	}

	private importMarkdown(data: string, config: ImportConfig): ContentItem[] {
		const items: ContentItem[] = [];
		const sections = data.split(/\n---\n/);

		for (const section of sections) {
			const lines = section.split("\n");
			const item: ContentItem = {
				_path: "",
				_dir: "",
				_partial: false,
			};

			for (const line of lines) {
				if (line.startsWith("# ")) {
					item.title = line.replace("# ", "").trim();
				} else if (line.startsWith("Description: ")) {
					item.description = line.replace("Description: ", "").trim();
				} else if (line.startsWith("Tags: ")) {
					item.tags = line.replace("Tags: ", "").trim().split(", ");
				} else if (line.startsWith("Updated: ")) {
					item.updatedAt = line.replace("Updated: ", "").trim();
				} else if (line.trim() && !line.startsWith("#")) {
					if (!item.body) item.body = "";
					item.body += line + "\n";
				}
			}

			if (item.title) {
				items.push(item);
			}
		}

		if (config.validate) {
			this.validateItems(items);
		}

		return items;
	}

	private importCSV(data: string, config: ImportConfig): ContentItem[] {
		const lines = data.split("\n");
		const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""));

		const items: ContentItem[] = [];

		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(",").map((v) => v.replace(/"/g, ""));
			const item: ContentItem = {
				_path: values[0],
				_dir: values[1],
				_partial: false,
				title: values[2],
				description: values[3],
			};

			if (headers.includes("body")) {
				const bodyIndex = headers.indexOf("body");
				item.body = values[bodyIndex];
			}

			items.push(item);
		}

		if (config.validate) {
			this.validateItems(items);
		}

		return items;
	}

	private validateItems(items: any[]): void {
		for (const item of items) {
			if (!item._path || !item._dir) {
				throw new Error("Invalid content item: missing _path or _dir");
			}
		}
	}

	async exportToFile(
		content: ContentItem[],
		config: ExportConfig,
		filename: string,
	): Promise<void> {
		const data = await this.exportContent(content, config);

		// In a real implementation, this would write to a file
		// For now, we'll just log it
		console.log(`Exporting to ${filename}:\n${data}`);
	}

	async importFromFile(
		_filename: string,
		_config: ImportConfig,
	): Promise<ContentItem[]> {
		// In a real implementation, this would read from a file
		// For now, we'll just return an empty array
		return [];
	}
}

// Singleton instance
let exportImportInstance: ContentExportImport | null = null;

export function useContentExportImport(): ContentExportImport {
	if (!exportImportInstance) {
		exportImportInstance = new ContentExportImport();
	}
	return exportImportInstance;
}

// Helper composable for export/import
export function useExportImport() {
	const exportImport = useContentExportImport();

	return {
		exportContent: (
			content: ContentItem[],
			config: ExportConfig,
		) => exportImport.exportContent(content, config),
		importContent: (
			data: string,
			config: ImportConfig,
		) => exportImport.importContent(data, config),
		exportToFile: (
			content: ContentItem[],
			config: ExportConfig,
			filename: string,
		) => exportImport.exportToFile(content, config, filename),
		importFromFile: (
			filename: string,
			config: ImportConfig,
		) => exportImport.importFromFile(filename, config),
	};
}
