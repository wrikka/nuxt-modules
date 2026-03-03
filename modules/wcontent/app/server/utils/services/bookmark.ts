import type { Bookmark } from "../../../shared/types/bookmark";

export class BookmarkManager {
	private bookmarks: Map<string, Bookmark[]> = new Map();

	async addBookmark(userId: string, contentPath: string, contentTitle: string): Promise<Bookmark> {
		const userBookmarks = this.bookmarks.get(userId) || [];
		const existing = userBookmarks.find(b => b.contentPath === contentPath);

		if (existing) {
			return existing;
		}

		const bookmark: Bookmark = {
			id: `bookmark-${Date.now()}-${Math.random().toString(36).substring(2)}`,
			userId,
			contentPath,
			contentTitle,
			createdAt: Date.now(),
			createdAtISO: new Date().toISOString(),
		};

		userBookmarks.push(bookmark);
		this.bookmarks.set(userId, userBookmarks);

		return bookmark;
	}

	async removeBookmark(userId: string, contentPath: string): Promise<boolean> {
		const userBookmarks = this.bookmarks.get(userId) || [];
		const index = userBookmarks.findIndex(b => b.contentPath === contentPath);

		if (index === -1) {
			return false;
		}

		userBookmarks.splice(index, 1);
		this.bookmarks.set(userId, userBookmarks);
		return true;
	}

	async isBookmarked(userId: string, contentPath: string): Promise<boolean> {
		const userBookmarks = this.bookmarks.get(userId) || [];
		return userBookmarks.some(b => b.contentPath === contentPath);
	}

	async getUserBookmarks(userId: string): Promise<Bookmark[]> {
		return this.bookmarks.get(userId) || [];
	}
}

let instance: BookmarkManager | null = null;

export function getBookmarkManager(): BookmarkManager {
	if (!instance) {
		instance = new BookmarkManager();
	}
	return instance;
}
