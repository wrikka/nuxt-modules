import type { ApiResponse, PaginationMeta } from "~/shared/types";
export declare function createSuccessResponse<T>(data: T, meta?: PaginationMeta): ApiResponse<T>;
export declare function createErrorResponse<T = unknown>(code: string, message: string, details?: unknown): ApiResponse<T>;
export declare function getPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
//# sourceMappingURL=response.d.ts.map