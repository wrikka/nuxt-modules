import { createDatabase } from "../../../../utils/database";
import type { ParsedContent } from "../../../../../shared/types/collection";
import type { H3Event } from "h3";

// GET /api/content/:collection/navigation
export default defineEventHandler(async (event: H3Event) => {
  const collection = getRouterParam(event, "collection");
  if (!collection) {
    throw createError({ statusCode: 400, statusMessage: "Collection required" });
  }

  const config = useRuntimeConfig().wcontent;
  const db = createDatabase(config.database);
  await db.init();

  try {
    const items = await db.find(collection, {
      sort: [{ field: "_path", direction: "asc" }],
    });

    // Build navigation tree
    const navigation = buildNavigationTree(items);
    return navigation;
  } finally {
    await db.close();
  }
});

interface NavigationNode {
  title: string;
  path: string;
  children: NavigationNode[];
  [key: string]: any;
}

function buildNavigationTree(items: ParsedContent[]): NavigationNode[] {
  const root: NavigationNode[] = [];
  const map = new Map<string, NavigationNode>();

  for (const item of items) {
    if (item._draft || item._partial) continue;

    const node: NavigationNode = {
      title: item.title || item._file || item._path,
      path: item._path,
      children: [],
      ...extractMeta(item),
    };

    map.set(item._path, node);

    // Find parent
    const parentPath = getParentPath(item._path);
    if (parentPath && map.has(parentPath)) {
      map.get(parentPath)!.children.push(node);
    } else {
      root.push(node);
    }
  }

  return root;
}

function getParentPath(path: string): string | null {
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return null;
  
  parts.pop();
  return "/" + parts.join("/");
}

function extractMeta(item: ParsedContent): Record<string, any> {
  const meta: Record<string, any> = {};
  const includeKeys = ["order", "icon", "category", "tags", "description"];
  
  for (const key of includeKeys) {
    if (item[key] !== undefined) {
      meta[key] = item[key];
    }
  }
  
  return meta;
}
