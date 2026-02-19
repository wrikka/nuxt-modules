import type { Category } from "#shared/types";
interface CategoryTree extends Category {
    children: CategoryTree[];
}
export declare const useCategoryUtils: () => {
    getCategoryById: (categories: Category[], id: number) => Category | undefined;
    getCategoryPath: (categories: Category[], categoryId: number) => Category[];
    getChildCategories: (categories: Category[], parentId: number) => Category[];
    getDescendantCategories: (categories: Category[], parentId: number) => Category[];
    buildCategoryTree: (categories: Category[], parentId?: number | null) => CategoryTree[];
    searchCategories: (categories: Category[], query: string) => Category[];
    canDeleteCategory: (categories: Category[], categoryId: number) => boolean;
    getCategoryStats: (categories: Category[]) => {
        total: number;
        active: number;
        inactive: number;
        root: number;
        withChildren: number;
    };
};
export {};
//# sourceMappingURL=useCategoryUtils.d.ts.map