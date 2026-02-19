export const useCategoryUtils = () => {
  const getCategoryById = (categories, id) => categories.find((cat) => cat.id === id);
  const getCategoryPath = (categories, categoryId) => {
    const path = [];
    let currentCategory = getCategoryById(categories, categoryId);
    while (currentCategory) {
      path.unshift(currentCategory);
      currentCategory = currentCategory.parentId ? getCategoryById(categories, currentCategory.parentId) : void 0;
    }
    return path;
  };
  const getChildCategories = (categories, parentId) => categories.filter((cat) => cat.parentId === parentId);
  const getDescendantCategories = (categories, parentId) => {
    const descendants = [];
    const children = getChildCategories(categories, parentId);
    children.forEach((child) => {
      descendants.push(child);
      descendants.push(...getDescendantCategories(categories, child.id));
    });
    return descendants;
  };
  const buildCategoryTree = (categories, parentId = null) => {
    return categories.filter((cat) => cat.parentId === parentId).map((cat) => ({ ...cat, children: buildCategoryTree(categories, cat.id) }));
  };
  const searchCategories = (categories, query) => {
    if (!query.trim()) return categories;
    const searchTerm = query.toLowerCase();
    return categories.filter(
      (cat) => cat.name.toLowerCase().includes(searchTerm) || cat.description?.toLowerCase().includes(searchTerm)
    );
  };
  const canDeleteCategory = (categories, categoryId) => {
    return getChildCategories(categories, categoryId).length === 0;
  };
  const getCategoryStats = (categories) => {
    const activeCategories = categories.filter((cat) => cat.isActive);
    const rootCategories = categories.filter((cat) => !cat.parentId);
    return {
      total: categories.length,
      active: activeCategories.length,
      inactive: categories.length - activeCategories.length,
      root: rootCategories.length,
      withChildren: categories.filter((cat) => getChildCategories(categories, cat.id).length > 0).length
    };
  };
  return {
    getCategoryById,
    getCategoryPath,
    getChildCategories,
    getDescendantCategories,
    buildCategoryTree,
    searchCategories,
    canDeleteCategory,
    getCategoryStats
  };
};
