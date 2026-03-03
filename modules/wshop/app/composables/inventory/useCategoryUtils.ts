import type { Category } from "#shared/types"

interface CategoryTree extends Category {
	children: CategoryTree[]
}

export const useCategoryUtils = () => {
	const getCategoryById = (categories: Category[], id: number): Category | undefined =>
		categories.find((cat: Category) => cat.id === id)

	const getCategoryPath = (categories: Category[], categoryId: number): Category[] => {
		const path: Category[] = []
		let currentCategory = getCategoryById(categories, categoryId)
		while (currentCategory) {
			path.unshift(currentCategory)
			currentCategory = currentCategory.parentId
				? getCategoryById(categories, currentCategory.parentId)
				: undefined
		}
		return path
	}

	const getChildCategories = (categories: Category[], parentId: number): Category[] =>
		categories.filter((cat: Category) => cat.parentId === parentId)

	const getDescendantCategories = (categories: Category[], parentId: number): Category[] => {
		const descendants: Category[] = []
		const children = getChildCategories(categories, parentId)
		children.forEach((child: Category) => {
			descendants.push(child)
			descendants.push(...getDescendantCategories(categories, child.id))
		})
		return descendants
	}

	const buildCategoryTree = (
		categories: Category[],
		parentId: number | null = null,
	): CategoryTree[] => {
		return categories
			.filter((cat: Category) => cat.parentId === parentId)
			.map((cat: Category) => ({ ...cat, children: buildCategoryTree(categories, cat.id) }))
	}

	const searchCategories = (categories: Category[], query: string): Category[] => {
		if (!query.trim()) return categories
		const searchTerm = query.toLowerCase()
		return categories.filter((cat: Category) =>
			cat.name.toLowerCase().includes(searchTerm)
			|| cat.description?.toLowerCase().includes(searchTerm)
		)
	}

	const canDeleteCategory = (categories: Category[], categoryId: number): boolean => {
		return getChildCategories(categories, categoryId).length === 0
	}

	const getCategoryStats = (
		categories: Category[],
	): { total: number; active: number; inactive: number; root: number; withChildren: number } => {
		const activeCategories = categories.filter((cat: Category) => cat.isActive)
		const rootCategories = categories.filter((cat: Category) => !cat.parentId)

		return {
			total: categories.length,
			active: activeCategories.length,
			inactive: categories.length - activeCategories.length,
			root: rootCategories.length,
			withChildren:
				categories.filter((cat: Category) => getChildCategories(categories, cat.id).length > 0)
					.length,
		}
	}

	return {
		getCategoryById,
		getCategoryPath,
		getChildCategories,
		getDescendantCategories,
		buildCategoryTree,
		searchCategories,
		canDeleteCategory,
		getCategoryStats,
	}
}
