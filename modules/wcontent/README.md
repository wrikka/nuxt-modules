# @wrikka/wcontent

Advanced Content Management Module for Nuxt - Inspired by Nuxt Content v3 with enhanced features.

## Features (24 Total)

### Core Infrastructure (Features 1-6)
1. **Content Collections** - Define typed collections with Zod schemas in `content.config.ts`
2. **Database Adapter** - SQLite-based storage for production (replaces Vite glob)
3. **Enhanced Query Builder** - MongoDB-like API with `.where()`, `.sort()`, `.limit()`, `.skip()`, `.only()`, `.without()`
4. **Auto Type Generation** - Automatic TypeScript types from collection schemas
5. **Markdown Processor** - Powered by `@wrikka/wmarkdown` with MDC support, Shiki syntax highlighting, typography enhancements
6. **ContentRenderer Component** - `<ContentDoc>` component for rendering content

### Search & Navigation (Features 7-10)
7. **Full-text Search** - SQLite FTS5 search with fuzzy matching
8. **Navigation Generation** - Auto-generated navigation tree from content structure
9. **Prev/Next Links** - `<ContentSurround>` for pagination
10. **Table of Contents** - Auto-generated TOC from headings

### Content Management (Features 11-15)
11. **Content Validation** - Zod schema validation at build time
12. **Draft/Published Status** - Control content visibility
13. **Content Hooks** - Transform hooks for preprocessing
14. **Multi-format Support** - Markdown, YAML, JSON, CSV
15. **Content Relations** - Link related content (authors, posts, etc.)

### Developer Experience (Features 16-18)
16. **Live Preview** - Real-time content updates in dev mode
17. **Import/Export** - JSON/YAML/ZIP content migration
18. **Image Optimization** - Nuxt Image integration

### SEO & UX (Features 19-21)
19. **Breadcrumbs** - `<ContentBreadcrumbs>` component
20. **Reading Time** - Auto-calculated from word count
21. **Word Count** - Automatic calculation

### Distribution (Features 22-24)
22. **Sitemap Integration** - Auto-generated sitemap
23. **RSS Feed** - `/rss.xml` endpoint
24. **OG Image** - Open Graph meta tags

## Installation

```bash
bun add @wrikka/wcontent
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@wrikka/wcontent"],
  wcontent: {
    contentDirs: ["content"],
    database: {
      type: "sqlite",
      path: ".data/content.db",
    },
    search: {
      enabled: true,
      fuzzy: true,
    },
    sitemap: {
      enabled: true,
    },
    rss: {
      enabled: true,
      title: "My Blog",
      description: "Latest articles",
    },
  },
});
```

## Content Collections

```typescript
// content.config.ts
import { defineCollection, defineContentConfig } from "@wrikka/wcontent";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().default(false),
      }),
    }),
    authors: defineCollection({
      type: "data",
      source: "authors/*.yml",
      schema: z.object({
        name: z.string(),
        bio: z.string(),
        avatar: z.string(),
      }),
    }),
  },
});
```

## Usage

### Query Content

```vue
<script setup>
// Fetch all published blog posts
const posts = await queryContent("blog")
  .where("draft", false)
  .sort("date", "desc")
  .limit(10)
  .find();

// Find specific content
const post = await queryContent("blog")
  .where("_path", "/blog/hello-world")
  .findOne();

// Search content
const { search } = useContentSearch();
const results = await search("nuxt", { collections: ["blog"] });
</script>
```

### Render Content

```vue
<template>
  <ContentDoc path="/blog/hello-world" collection="blog" />
  
  <!-- With custom slots -->
  <ContentDoc 
    path="/blog/hello-world" 
    collection="blog"
    v-slot="{ content, meta }"
  >
    <article>
      <h1>{{ meta.title }}</h1>
      <ContentMeta :reading-time="meta.readingTime" />
      <div v-html="content.body" />
      <ContentToc :items="content.toc" />
    </article>
  </ContentDoc>
</template>
```

### Navigation & Breadcrumbs

```vue
<template>
  <ContentNavigation collection="docs" />
  <ContentBreadcrumbs :path="$route.path" />
  <ContentSurround collection="docs" :path="$route.path" />
</template>
```

### Search UI

```vue
<template>
  <ContentSearch collection="blog" placeholder="Search articles..." />
</template>
```

### List Content

```vue
<template>
  <ContentList 
    collection="blog" 
    :where="{ draft: false }"
    sort="date"
    :limit="10"
  >
    <template #item="{ item }">
      <article>
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
      </article>
    </template>
  </ContentList>
</template>
```

## API Routes

- `GET /api/content/:collection` - List/query content
- `GET /api/content/:collection?path=:path` - Get single item
- `GET /api/content/:collection/count` - Count items
- `GET /api/content/:collection/surround?path=:path` - Get prev/next
- `GET /api/content/:collection/navigation` - Get navigation tree
- `GET /api/content/search?q=:query` - Search content
- `GET /api/__sitemap__/content` - Sitemap data
- `GET /rss.xml` - RSS feed

## Components

| Component | Description |
|-----------|-------------|
| `<ContentDoc>` | Render content document |
| `<ContentList>` | List content items |
| `<ContentSearch>` | Search input with results |
| `<ContentNavigation>` | Navigation tree |
| `<ContentSurround>` | Prev/Next links |
| `<ContentToc>` | Table of contents |
| `<ContentBreadcrumbs>` | Breadcrumb navigation |
| `<ContentMeta>` | Reading time, date, word count |
| `<ContentOgImage>` | OG meta tags |
| `<ContentError>` | Error display |
| `<ContentLoading>` | Loading states |

## Composables

| Composable | Description |
|------------|-------------|
| `queryContent()` | Query builder for content |
| `useContentSearch()` | Search functionality |
| `useContentNavigation()` | Navigation fetching |
| `useContent()` | Fetch single content |
| `useContentList()` | Fetch content list with pagination |

## Comparison with Nuxt Content

| Feature | wcontent | Nuxt Content v3 |
|---------|----------|-----------------|
| Collections | ✅ Full | ✅ Full |
| Database | ✅ SQLite | ✅ SQL |
| Query Builder | ✅ Mongo-like | ✅ Mongo-like |
| Auto Types | ✅ Generated | ✅ Generated |
| Search | ✅ Built-in | ⚠️ Plugin |
| CMS UI | ✅ Built-in | ❌ Nuxt Studio |
| Comments | ✅ Built-in | ❌ None |
| Version History | ✅ Built-in | ❌ None |
| Real-time Collab | ✅ Built-in | ❌ None |
| Backup | ✅ Built-in | ❌ None |

## Development

```bash
# Install dependencies
bun install

# Development
bun run dev

# Build
bun run build

# Test
bun run test

# Type check
bun run typecheck
```

## License

MIT
