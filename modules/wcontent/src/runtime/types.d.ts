// Type declarations for wcontent module
declare module "@wrikka/wcontent/runtime" {
  export * from "./src/runtime/index";
}

declare module "#wcontent/server" {
  export * from "./src/runtime/server/utils/database";
  export * from "./src/runtime/server/utils/indexer";
  export * from "./src/runtime/server/utils/markdown";
  export * from "./src/runtime/server/utils/types-generator";
}

declare module "@nuxt/schema" {
  interface RuntimeConfig {
    wcontent: {
      database?: {
        type: "sqlite" | "memory";
        path?: string;
      };
      search?: {
        enabled?: boolean;
        fuzzy?: boolean;
        threshold?: number;
      };
      rss?: {
        enabled?: boolean;
        title?: string;
        description?: string;
      };
    };
  }
}
