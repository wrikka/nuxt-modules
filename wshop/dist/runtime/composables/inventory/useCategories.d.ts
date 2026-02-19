import type { Category } from "#shared/types";
interface CategoryTree extends Category {
    children: CategoryTree[];
}
export declare function useCategories(): {
    categories: import("vue").Ref<any, any>;
    loading: import("vue").Ref<boolean, boolean>;
    processing: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    activeCategories: import("vue").ComputedRef<any>;
    rootCategories: import("vue").ComputedRef<any>;
    categoryTree: import("vue").ComputedRef<CategoryTree[]>;
    loadCategories: () => Promise<void>;
    createCategory: (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<Category>;
    updateCategory: (id: number, updates: Partial<Category>) => Promise<Category>;
    deleteCategory: (id: number) => Promise<void>;
    bulkUpdateCategories: (updates: Array<{
        id: number;
        updates: Partial<Category>;
    }>) => Promise<void>;
    reorderCategories: (categoryIds: number[]) => Promise<void>;
    exportCategories: (format?: "csv" | "json") => Promise<void>;
    importCategories: (file: File) => Promise<Category[]>;
    getCategoryById: (id: number) => Category | undefined;
    getCategoryPath: (categoryId: number) => Category[];
    getChildCategories: (parentId: number) => Category[];
    getDescendantCategories: (parentId: number) => Category[];
    getProductCount: (categoryId: number) => Promise<number>;
    canDeleteCategory: (categoryId: number) => boolean;
    searchCategories: (query: string) => Category[];
    getCategoryStats: () => {
        total: number;
        active: number;
        inactive: number;
        root: number;
        withChildren: number;
    };
};
export {};
//# sourceMappingURL=useCategories.d.ts.map