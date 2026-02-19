import { z } from "zod";
export declare const CategorySchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    parentId: z.ZodNullable<z.ZodNumber>;
    image: z.ZodOptional<z.ZodString>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    parentId: number | null;
    description?: string | undefined;
    image?: string | undefined;
}, {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    parentId: number | null;
    description?: string | undefined;
    image?: string | undefined;
}>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoryTree = Category & {
    children: CategoryTree[];
};
export declare const CategoryTreeSchema: z.ZodType<CategoryTree>;
//# sourceMappingURL=category.d.ts.map