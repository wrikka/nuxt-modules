import type { Bookmark } from "../../shared/types/bookmark";

export function useBookmark() {
	const addBookmark = async (
		userId: string,
		contentPath: string,
		contentTitle: string,
	): Promise<Bookmark> => {
		const response = await $fetch("/api/bookmark/add", {
			method: "POST",
			body: { userId, contentPath, contentTitle },
		});
		return response as Bookmark;
	};

	const removeBookmark = async (userId: string, contentPath: string): Promise<{ success: boolean }> => {
		const response = await $fetch("/api/bookmark/remove", {
			method: "DELETE",
			query: { userId, contentPath },
		});
		return response as { success: boolean };
	};

	const listBookmarks = async (userId: string): Promise<Bookmark[]> => {
		const response = await $fetch("/api/bookmark/list", {
			method: "GET",
			query: { userId },
		});
		return response as Bookmark[];
	};

	return {
		addBookmark,
		removeBookmark,
		listBookmarks,
	};
}
