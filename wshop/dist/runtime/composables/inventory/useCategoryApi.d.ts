import type { Category } from "#shared/types";
export declare function useCategoryApi(): {
    fetchCategories: () => Promise<any>;
    createCategory: (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<any>;
    updateCategory: (id: number, updates: Partial<Category>) => Promise<any>;
    deleteCategory: (id: number) => Promise<void>;
    bulkUpdateCategories: (updates: Array<{
        id: number;
        updates: Partial<Category>;
    }>) => Promise<any>;
    reorderCategories: (categoryIds: number[]) => Promise<any>;
    exportCategories: (format?: "csv" | "json") => Promise<any>;
    importCategories: (file: File) => Promise<any>;
    getProductCount: (categoryId: number) => Promise<any>;
};
//# sourceMappingURL=useCategoryApi.d.ts.map