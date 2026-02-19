import { z } from "zod";
export declare const ApiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string;
        details?: unknown;
    }, {
        message: string;
        code: string;
        details?: unknown;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        total: z.ZodOptional<z.ZodNumber>;
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
    }, {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string;
        details?: unknown;
    }, {
        message: string;
        code: string;
        details?: unknown;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        total: z.ZodOptional<z.ZodNumber>;
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
    }, {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
    }>>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string;
        details?: unknown;
    }, {
        message: string;
        code: string;
        details?: unknown;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        total: z.ZodOptional<z.ZodNumber>;
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
    }, {
        page?: number | undefined;
        limit?: number | undefined;
        total?: number | undefined;
    }>>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>;
export declare const PaginationQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    sort?: string | undefined;
    order?: "asc" | "desc" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}, {
    sort?: string | undefined;
    order?: "asc" | "desc" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export declare const PaginationMetaSchema: z.ZodObject<{
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
//# sourceMappingURL=api.d.ts.map