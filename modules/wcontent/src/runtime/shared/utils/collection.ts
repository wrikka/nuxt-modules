import type { ZodSchema } from "zod";
import type { ContentCollection, ContentConfig } from "../types/collection";

export function defineCollection<T>(config: ContentCollection<T>): ContentCollection<T> {
  return config;
}

export function defineContentConfig(config: ContentConfig): ContentConfig {
  return config;
}

export function validateCollection<T>(
  data: unknown,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`),
  };
}
