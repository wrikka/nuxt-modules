import type { ZodSchema } from "zod";

export type CollectionType = "page" | "data";

export interface ContentCollection<T = any> {
  type: CollectionType;
  source: string | string[];
  schema: ZodSchema<T>;
  transform?: (data: T) => T | Promise<T>;
}

export interface ContentConfig {
  collections: Record<string, ContentCollection>;
}

export interface ParsedContent {
  _path: string;
  _dir: string;
  _file: string;
  _extension: string;
  _draft: boolean;
  _partial: boolean;
  _collection: string;
  title?: string;
  description?: string;
  body?: string;
  [key: string]: any;
}

export interface CollectionEntry<T = any> extends ParsedContent {
  _raw: T;
}

export type WhereOperator = {
  $eq?: any;
  $ne?: any;
  $gt?: number | string;
  $gte?: number | string;
  $lt?: number | string;
  $lte?: number | string;
  $in?: any[];
  $nin?: any[];
  $contains?: string;
  $startsWith?: string;
  $endsWith?: string;
  $regex?: string;
};

export type WhereQuery = Record<string, WhereOperator | any>;

export interface QueryOptions {
  skip?: number;
  limit?: number;
  sort?: {
    field: string;
    direction?: "asc" | "desc";
  }[];
  only?: string[];
  without?: string[];
  where?: WhereQuery;
}
