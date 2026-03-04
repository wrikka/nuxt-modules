import { createQueryBuilder, type QueryBuilder } from "./query-builder";
import type { ParsedContent } from "../../shared/types/collection";

// Main query function
export function queryContent<T = ParsedContent>(collection: string): QueryBuilder<T> {
  const { $fetch } = useNuxtApp();
  return createQueryBuilder<T>(collection, $fetch);
}

// Search composable
export function useContentSearch() {
  const { $fetch } = useNuxtApp();

  async function search<T = ParsedContent>(
    query: string,
    options?: {
      collections?: string[];
      limit?: number;
    }
  ): Promise<T[]> {
    return $fetch<T[]>("/api/content/search", {
      params: {
        q: query,
        collections: options?.collections?.join(","),
        limit: options?.limit,
      },
    });
  }

  return { search };
}

// Navigation composable
export function useContentNavigation(collection: string) {
  const { $fetch } = useNuxtApp();

  async function fetchNavigation(): Promise<NavigationItem[]> {
    return $fetch<NavigationItem[]>(`/api/content/${collection}/navigation`);
  }

  return { fetchNavigation };
}

// Single content item
export async function useContent<T = ParsedContent>(collection: string, path: string): Promise<T | null> {
  const { $fetch } = useNuxtApp();
  
  return $fetch<T | null>(`/api/content/${collection}`, {
    params: { path },
  });
}

// Content list with pagination
export function useContentList<T = ParsedContent>(collection: string, options?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
}) {
  const { $fetch } = useNuxtApp();
  const page = ref(options?.page || 1);
  const pageSize = options?.pageSize || 10;

  const { data, status, refresh } = useAsyncData(
    `${collection}-list-${page.value}`,
    () => $fetch<T[]>(`/api/content/${collection}`, {
      params: {
        skip: (page.value - 1) * pageSize,
        limit: pageSize,
        sort: options?.sort,
        order: options?.order,
      },
    }),
    { watch: [page] }
  );

  return {
    items: data,
    page,
    pageSize,
    loading: computed(() => status.value === "pending"),
    refresh,
  };
}

export interface NavigationItem {
  title: string;
  path: string;
  children?: NavigationItem[];
  [key: string]: any;
}
