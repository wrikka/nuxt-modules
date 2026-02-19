import { z } from "zod";
export declare const PageBlockSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    props: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: string;
    props: Record<string, any>;
}, {
    id: string;
    type: string;
    props: Record<string, any>;
}>;
export type PageBlock = z.infer<typeof PageBlockSchema>;
export declare const PageSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    slug: z.ZodString;
    content: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        props: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: string;
        props: Record<string, any>;
    }, {
        id: string;
        type: string;
        props: Record<string, any>;
    }>, "many">;
    status: z.ZodEnum<["draft", "published"]>;
    locale: z.ZodString;
    metaTitle: z.ZodNullable<z.ZodString>;
    metaDescription: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    locale: string;
    status: "draft" | "published";
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    content: {
        id: string;
        type: string;
        props: Record<string, any>;
    }[];
    slug: string;
    metaTitle: string | null;
    metaDescription: string | null;
}, {
    locale: string;
    status: "draft" | "published";
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    content: {
        id: string;
        type: string;
        props: Record<string, any>;
    }[];
    slug: string;
    metaTitle: string | null;
    metaDescription: string | null;
}>;
export type Page = z.infer<typeof PageSchema>;
//# sourceMappingURL=page.d.ts.map