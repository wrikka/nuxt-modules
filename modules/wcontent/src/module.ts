import { createResolver, defineNuxtModule, useLogger } from "@nuxt/kit";
import type { Nuxt } from "@nuxt/schema";
import { defu } from "defu";
import type { ContentCollection, ContentConfig } from "./runtime/shared/types/collection";
import { loadContentConfig } from "./runtime/server/utils/config";
import { createDatabase } from "./runtime/server/utils/database";
import { indexContent } from "./runtime/server/utils/indexer";
import { generateTypes } from "./runtime/server/utils/types-generator";

export { defineCollection, defineContentConfig } from "./runtime/shared/utils/collection";

export interface ModuleOptions {
  contentDirs?: string[];
  watch?: boolean;
  highlight?: boolean;
  database?: {
    type: "sqlite" | "memory";
    path?: string;
  };
  markdown?: {
    breaks?: boolean;
    linkify?: boolean;
    typographer?: boolean;
  };
  search?: {
    enabled?: boolean;
    fuzzy?: boolean;
    threshold?: number;
  };
  sitemap?: {
    enabled?: boolean;
    hostname?: string;
  };
  rss?: {
    enabled?: boolean;
    title?: string;
    description?: string;
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@wrikka/wcontent",
    configKey: "wcontent",
    compatibility: {
      nuxt: "^4.0.0",
    },
  },
  defaults: {
    contentDirs: ["content"],
    watch: true,
    highlight: true,
    database: {
      type: "sqlite",
      path: ".data/content.db",
    },
    markdown: {
      breaks: true,
      linkify: true,
      typographer: true,
    },
    search: {
      enabled: true,
      fuzzy: true,
      threshold: 0.4,
    },
    sitemap: {
      enabled: true,
    },
    rss: {
      enabled: true,
    },
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const logger = useLogger("@wrikka/wcontent");

    // Load content.config.ts
    const contentConfig = await loadContentConfig(nuxt.options.rootDir);
    
    // Create database instance
    const db = createDatabase(options.database!);
    
    // Index content on build/dev startup
    nuxt.hook("build:before", async () => {
      await indexContent(db, contentConfig, options.contentDirs!, nuxt.options.rootDir);
      logger.success("Content indexed successfully");
    });

    nuxt.hook("builder:watch", async (event, path) => {
      if (path.includes("content/")) {
        await indexContent(db, contentConfig, options.contentDirs!, nuxt.options.rootDir);
        logger.info(`Content re-indexed: ${path}`);
      }
    });

    // Generate types
    nuxt.hook("prepare:types", async ({ references }) => {
      await generateTypes(contentConfig, nuxt.options.buildDir);
      references.push({
        types: resolver.resolve("./runtime/types.d.ts"),
      });
    });

    // Add runtime config
    nuxt.options.runtimeConfig.wcontent = defu(nuxt.options.runtimeConfig.wcontent, {
      database: options.database,
      search: options.search,
    });

    // Register server utils
    nuxt.options.alias["#wcontent/server"] = resolver.resolve("./runtime/server");
    
    // Register composables
    addImportsDir(resolver.resolve("./runtime/app/composables"));
    
    // Register components
    addComponentsDir({
      path: resolver.resolve("./runtime/app/components"),
      prefix: "Content",
    });

    // Register plugins
    addPlugin(resolver.resolve("./runtime/app/plugins/content"));
    
    // Setup sitemap integration
    if (options.sitemap?.enabled) {
      setupSitemap(nuxt, contentConfig, options.sitemap);
    }
    
    // Setup RSS feed
    if (options.rss?.enabled) {
      setupRSS(nuxt, contentConfig, options.rss);
    }

    logger.success("wcontent module loaded");
  },
});

function setupSitemap(nuxt: Nuxt, config: ContentConfig, options: ModuleOptions["sitemap"]) {
  nuxt.options.runtimeConfig.public.sitemap = defu(nuxt.options.runtimeConfig.public.sitemap, {
    sources: ["/api/__sitemap__/content"],
  });
}

function setupRSS(nuxt: Nuxt, config: ContentConfig, options: ModuleOptions["rss"]) {
  nuxt.hook("nitro:config", (nitroConfig) => {
    nitroConfig.handlers = nitroConfig.handlers || [];
    nitroConfig.handlers.push({
      route: "/rss.xml",
      handler: "./runtime/server/routes/rss.ts",
    });
  });
}

async function addImportsDir(path: string) {
  const { addImportsDir } = await import("@nuxt/kit");
  addImportsDir(path);
}

async function addComponentsDir(options: { path: string; prefix: string }) {
  const { addComponentsDir } = await import("@nuxt/kit");
  addComponentsDir(options);
}

async function addPlugin(path: string) {
  const { addPlugin } = await import("@nuxt/kit");
  addPlugin(path);
}
