import { readFile, readdir, stat } from "node:fs/promises";
import { join, dirname, basename, extname, relative } from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import type { ContentConfig, ContentCollection, ParsedContent } from "../../shared/types/collection";
import type { DatabaseAdapter } from "./database";
import { validateCollection } from "../../shared/utils/collection";
import { processMarkdown } from "./markdown";

export async function loadContentConfig(rootDir: string): Promise<ContentConfig> {
  const configPath = join(rootDir, "content.config.ts");
  
  try {
    // Dynamic import of content.config.ts
    const configModule = await import(configPath);
    const config = configModule.default || configModule;
    
    return config as ContentConfig;
  } catch {
    // Return empty config if file doesn't exist
    return { collections: {} };
  }
}

export async function indexContent(
  db: DatabaseAdapter,
  config: ContentConfig,
  contentDirs: string[],
  rootDir: string
): Promise<void> {
  await db.init();

  for (const [name, collection] of Object.entries(config.collections)) {
    const files = await resolveContentFiles(collection.source, contentDirs, rootDir);

    for (const filePath of files) {
      try {
        const content = await parseContentFile(filePath, name, collection, rootDir);
        
        // Validate against schema
        const validation = validateCollection(content._raw, collection.schema);
        
        if (!validation.success) {
          console.warn(`Validation failed for ${filePath}:`, validation.errors);
          continue;
        }

        await db.insert(name, content);
      } catch (error) {
        console.error(`Failed to index ${filePath}:`, error);
      }
    }
  }
}

async function resolveContentFiles(
  source: string | string[],
  contentDirs: string[],
  rootDir: string
): Promise<string[]> {
  const patterns = Array.isArray(source) ? source : [source];
  const files: string[] = [];

  for (const pattern of patterns) {
    for (const contentDir of contentDirs) {
      const fullPattern = join(rootDir, contentDir, pattern);
      const matches = await glob(fullPattern, { absolute: true });
      files.push(...matches);
    }
  }

  return [...new Set(files)]; // Remove duplicates
}

async function parseContentFile(
  filePath: string,
  collectionName: string,
  collection: ContentCollection,
  rootDir: string
): Promise<ParsedContent> {
  const contentDir = findContentDir(filePath, rootDir);
  const relativePath = "/" + relative(contentDir, filePath).replace(/\\/g, "/");
  const ext = extname(filePath).slice(1);
  const fileName = basename(filePath, extname(filePath));
  const dir = dirname(relativePath).replace(/^\//, "");

  const content = await readFile(filePath, "utf-8");
  
  let parsed: { data: Record<string, any>; content: string };
  let body: string | undefined;

  // Parse based on file extension
  switch (ext) {
    case "md":
    case "markdown":
      parsed = matter(content);
      body = await processMarkdown(parsed.content);
      break;
    case "yml":
    case "yaml":
      parsed = { data: parseYaml(content), content: "" };
      break;
    case "json":
      parsed = { data: JSON.parse(content), content: "" };
      break;
    case "csv":
      parsed = { data: { rows: parseCsv(content) }, content: "" };
      break;
    default:
      parsed = { data: {}, content: "" };
  }

  const pathWithoutExt = relativePath.replace(/\.\w+$/, "");
  const isIndex = fileName === "index";
  const finalPath = isIndex 
    ? dirname(pathWithoutExt) || "/"
    : pathWithoutExt;

  const result: ParsedContent = {
    _path: finalPath,
    _dir: dir,
    _file: fileName,
    _extension: ext,
    _draft: parsed.data.draft === true || parsed.data.status === "draft",
    _partial: fileName.startsWith("_"),
    _collection: collectionName,
    title: parsed.data.title,
    description: parsed.data.description,
    body,
    createdAt: parsed.data.date || parsed.data.createdAt,
    updatedAt: parsed.data.updatedAt || parsed.data.lastModified,
    ...parsed.data,
    _raw: parsed.data,
  };

  // Apply transform if defined
  if (collection.transform) {
    const transformed = await collection.transform(result);
    return { ...result, ...transformed };
  }

  return result;
}

function findContentDir(filePath: string, rootDir: string): string {
  const dirs = ["content", "src/content", "app/content"];
  
  for (const dir of dirs) {
    const fullDir = join(rootDir, dir);
    if (filePath.startsWith(fullDir)) {
      return fullDir;
    }
  }
  
  return join(rootDir, "content");
}

function parseYaml(content: string): Record<string, any> {
  // Simple YAML parser for basic cases
  const result: Record<string, any> = {};
  const lines = content.split("\n");
  let currentKey: string | null = null;
  let currentArray: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("- ")) {
      // Array item
      if (currentKey) {
        currentArray.push(trimmed.slice(2).trim());
      }
    } else if (trimmed.includes(":")) {
      // Save previous array if exists
      if (currentKey && currentArray.length > 0) {
        result[currentKey] = currentArray;
        currentArray = [];
      }

      const [key, ...valueParts] = trimmed.split(":");
      const value = valueParts.join(":").trim();
      currentKey = key.trim();
      
      if (value) {
        // Try to parse as number or boolean
        if (value === "true") result[currentKey] = true;
        else if (value === "false") result[currentKey] = false;
        else if (!isNaN(Number(value))) result[currentKey] = Number(value);
        else result[currentKey] = value;
      }
    }
  }

  // Save last array if exists
  if (currentKey && currentArray.length > 0) {
    result[currentKey] = currentArray;
  }

  return result;
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || "";
    }
    
    rows.push(row);
  }

  return rows;
}
