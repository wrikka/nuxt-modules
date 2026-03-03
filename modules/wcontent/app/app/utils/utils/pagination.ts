import type { ContentItem } from "../../../shared/types";

export interface PaginationOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T = ContentItem> {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
		nextPage?: number;
		prevPage?: number;
	};
}

export class ContentPagination {
	paginate<T = ContentItem>(
		items: T[],
		options: PaginationOptions = {},
	): PaginatedResult<T> {
		const { page = 1, limit = 10, sortBy, sortOrder = "asc" } = options;

		// Apply sorting if specified
		let sortedItems = [...items];
		if (sortBy) {
			sortedItems.sort((a, b) => {
				const aVal = (a as any)[sortBy];
				const bVal = (b as any)[sortBy];

				if (aVal === undefined || bVal === undefined) return 0;

				if (typeof aVal === "string" && typeof bVal === "string") {
					return sortOrder === "asc"
						? aVal.localeCompare(bVal)
						: bVal.localeCompare(aVal);
				}

				if (typeof aVal === "number" && typeof bVal === "number") {
					return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
				}

				return 0;
			});
		}

		const total = sortedItems.length;
		const totalPages = Math.ceil(total / limit);
		const currentPage = Math.min(Math.max(page, 1), totalPages);
		const startIndex = (currentPage - 1) * limit;
		const endIndex = startIndex + limit;

		const data = sortedItems.slice(startIndex, endIndex);

		return {
			data,
			meta: {
				total,
				page: currentPage,
				limit,
				totalPages,
				hasNext: currentPage < totalPages,
				hasPrev: currentPage > 1,
				nextPage: currentPage < totalPages ? currentPage + 1 : undefined,
				prevPage: currentPage > 1 ? currentPage - 1 : undefined,
			},
		};
	}

	getPageNumbers(currentPage: number, totalPages: number, maxVisible = 5): number[] {
		const pages: number[] = [];

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const half = Math.floor(maxVisible / 2);
			let start = currentPage - half;
			let end = currentPage + half;

			if (start < 1) {
				start = 1;
				end = maxVisible;
			} else if (end > totalPages) {
				end = totalPages;
				start = totalPages - maxVisible + 1;
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}

		return pages;
	}

	getOffset(page: number, limit: number): number {
		return (page - 1) * limit;
	}

	getTotalItems(total: number, limit: number): number {
		return Math.ceil(total / limit);
	}

	getPageFromOffset(offset: number, limit: number): number {
		return Math.floor(offset / limit) + 1;
	}
}

let paginationInstance: ContentPagination | null = null;

export function getContentPagination(): ContentPagination {
	if (!paginationInstance) {
		paginationInstance = new ContentPagination();
	}
	return paginationInstance;
}
