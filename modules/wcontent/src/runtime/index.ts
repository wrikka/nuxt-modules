import type { ParsedContent } from "../shared/types/collection";

// Export types
export type { 
  ContentCollection, 
  ContentConfig, 
  ParsedContent,
  CollectionEntry,
  WhereOperator,
  WhereQuery,
  QueryOptions,
} from "./shared/types/collection";

export type { 
  QueryBuilder 
} from "./app/composables/query-builder";

export type { 
  NavigationItem 
} from "./app/composables/useContent";

export type { 
  TocItem 
} from "./server/utils/markdown";

// Re-export composables for external use
export { 
  queryContent,
  useContentSearch,
  useContentNavigation,
  useContent,
  useContentList,
} from "./app/composables/useContent";

export { 
  createQueryBuilder 
} from "./app/composables/query-builder";

// Re-export utilities
export { 
  processMarkdown,
  extractToc,
} from "./server/utils/markdown";

export {
  loadContentConfig,
  indexContent,
} from "./server/utils/indexer";

export {
  createDatabase,
} from "./server/utils/database";

export {
  generateTypes,
} from "./server/utils/types-generator";

export {
  defineCollection,
  defineContentConfig,
  validateCollection,
} from "./shared/utils/collection";
