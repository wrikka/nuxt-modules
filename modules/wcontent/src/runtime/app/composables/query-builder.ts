import type { ParsedContent, QueryOptions, WhereOperator, WhereQuery } from "../shared/types/collection";

export interface QueryBuilder<T = ParsedContent> {
  // Where clauses
  where(query: WhereQuery): QueryBuilder<T>;
  where(field: string, operator: keyof WhereOperator, value: any): QueryBuilder<T>;
  where(field: string, value: any): QueryBuilder<T>;
  
  // Ordering
  sort(field: string, direction?: "asc" | "desc"): QueryBuilder<T>;
  order(field: string, direction?: "asc" | "desc"): QueryBuilder<T>;
  
  // Pagination
  skip(n: number): QueryBuilder<T>;
  limit(n: number): QueryBuilder<T>;
  
  // Field selection
  only(...fields: (keyof T | string)[]): QueryBuilder<Pick<T, keyof T>>;
  without(...fields: (keyof T | string)[]): QueryBuilder<Omit<T, keyof T>>;
  
  // Execution
  find(): Promise<T[]>;
  findOne(): Promise<T | null>;
  count(): Promise<number>;
  
  // Navigation
  findSurround(path: string): Promise<{ prev: T | null; next: T | null }>;
}

class QueryBuilderImpl<T = ParsedContent> implements QueryBuilder<T> {
  private options: QueryOptions = {};
  private collection: string;
  private $fetch: typeof globalThis.$fetch;

  constructor(collection: string, $fetchInstance: typeof globalThis.$fetch) {
    this.collection = collection;
    this.$fetch = $fetchInstance;
    this.options = { where: {} };
  }

  where(query: WhereQuery): QueryBuilder<T>;
  where(field: string, operator: keyof WhereOperator, value: any): QueryBuilder<T>;
  where(field: string, value: any): QueryBuilder<T>;
  where(
    fieldOrQuery: string | WhereQuery,
    operatorOrValue?: keyof WhereOperator | any,
    value?: any
  ): QueryBuilder<T> {
    this.options.where = this.options.where || {};

    if (typeof fieldOrQuery === "string") {
      if (value !== undefined) {
        // where(field, operator, value)
        this.options.where[fieldOrQuery] = { [`$${operatorOrValue}`]: value };
      } else {
        // where(field, value) - shorthand for equality
        this.options.where[fieldOrQuery] = operatorOrValue;
      }
    } else {
      // where(query)
      Object.assign(this.options.where, fieldOrQuery);
    }

    return this;
  }

  sort(field: string, direction: "asc" | "desc" = "asc"): QueryBuilder<T> {
    if (!this.options.sort) {
      this.options.sort = [];
    }
    this.options.sort.push({ field, direction });
    return this;
  }

  order(field: string, direction: "asc" | "desc" = "asc"): QueryBuilder<T> {
    return this.sort(field, direction);
  }

  skip(n: number): QueryBuilder<T> {
    this.options.skip = n;
    return this;
  }

  limit(n: number): QueryBuilder<T> {
    this.options.limit = n;
    return this;
  }

  only(...fields: (keyof T | string)[]): QueryBuilder<Pick<T, keyof T>> {
    this.options.only = fields as string[];
    return this as QueryBuilder<Pick<T, keyof T>>;
  }

  without(...fields: (keyof T | string)[]): QueryBuilder<Omit<T, keyof T>> {
    this.options.without = fields as string[];
    return this as QueryBuilder<Omit<T, keyof T>>;
  }

  async find(): Promise<T[]> {
    return this.$fetch<T[]>(`/api/content/${this.collection}`, {
      params: this.buildParams(),
    });
  }

  async findOne(): Promise<T | null> {
    const results = await this.limit(1).find();
    return results[0] || null;
  }

  async count(): Promise<number> {
    return this.$fetch<number>(`/api/content/${this.collection}/count`, {
      params: this.buildParams(),
    });
  }

  async findSurround(path: string): Promise<{ prev: T | null; next: T | null }> {
    return this.$fetch<{ prev: T | null; next: T | null }>(`/api/content/${this.collection}/surround`, {
      params: { ...this.buildParams(), path },
    });
  }

  private buildParams(): Record<string, any> {
    return {
      where: this.options.where && Object.keys(this.options.where).length > 0 
        ? JSON.stringify(this.options.where) 
        : undefined,
      sort: this.options.sort && this.options.sort.length > 0
        ? JSON.stringify(this.options.sort)
        : undefined,
      skip: this.options.skip,
      limit: this.options.limit,
      only: this.options.only?.join(","),
      without: this.options.without?.join(","),
    };
  }
}

export function createQueryBuilder<T>(collection: string, $fetch: typeof globalThis.$fetch): QueryBuilder<T> {
  return new QueryBuilderImpl<T>(collection, $fetch);
}
