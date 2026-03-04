import { addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit";
import type { Nuxt } from "@nuxt/schema";
import { defu } from "defu";
import type { ContentConfig } from "./src/runtime/shared/types/collection";
import { loadContentConfig, indexContent } from "./src/runtime/server/utils/indexer";
import { createDatabase } from "./src/runtime/server/utils/database";
import { generateTypes } from "./src/runtime/server/utils/types-generator";

export { defineCollection, defineContentConfig } from "./src/runtime/shared/utils/collection";

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
    dependencies: ["@wrikka/wmarkdown"],
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

    const contentConfig = await loadContentConfig(nuxt.options.rootDir);
    const db = createDatabase(options.database!);
    
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

    nuxt.hook("prepare:types", async ({ references }) => {
      await generateTypes(contentConfig, nuxt.options.buildDir);
      references.push({
        types: resolver.resolve("./src/runtime/types.d.ts"),
      });
    });

    nuxt.options.runtimeConfig.wcontent = defu(nuxt.options.runtimeConfig.wcontent, {
      database: options.database,
      search: options.search,
    });

    nuxt.options.alias["#wcontent/server"] = resolver.resolve("./src/runtime/server");
    addImportsDir(resolver.resolve("./src/runtime/app/composables"));
    addComponentsDir({
      path: resolver.resolve("./src/runtime/app/components"),
      prefix: "Content",
    });
    addPlugin(resolver.resolve("./src/runtime/app/plugins/content.ts"));
    
    if (options.sitemap?.enabled) {
      nuxt.options.runtimeConfig.public.sitemap = defu(nuxt.options.runtimeConfig.public.sitemap, {
        sources: ["/api/__sitemap__/content"],
      });
    }
    
    if (options.rss?.enabled) {
      nuxt.hook("nitro:config", (nitroConfig) => {
        nitroConfig.handlers = nitroConfig.handlers || [];
        nitroConfig.handlers.push({
          route: "/rss.xml",
          handler: resolver.resolve("./src/runtime/server/routes/rss.ts"),
        });
      });
    }

    logger.success("wcontent module loaded");
  },
});
