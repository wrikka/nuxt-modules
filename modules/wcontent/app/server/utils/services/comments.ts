import type { Comment, CommentResult } from "../../../shared/types/comments";

export class CommentManager {
	private comments: Map<string, Comment[]> = new Map();

	async addComment(
		contentPath: string,
		authorId: string,
		authorName: string,
		content: string,
		parentId?: string,
	): Promise<CommentResult> {
		try {
			const comment: Comment = {
				id: `comment-${Date.now()}-${Math.random().toString(36).substring(2)}`,
				contentPath,
				authorId,
				authorName,
				content,
				createdAt: Date.now(),
				createdAtISO: new Date().toISOString(),
				parentId,
			};

			const pathComments = this.comments.get(contentPath) || [];
			pathComments.push(comment);
			this.comments.set(contentPath, pathComments);

			return {
				success: true,
				comment,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message || "Failed to add comment",
			};
		}
	}

	async deleteComment(commentId: string): Promise<boolean> {
		for (const [contentPath, comments] of this.comments.entries()) {
			const index = comments.findIndex(c => c.id === commentId);
			if (index !== -1) {
				comments.splice(index, 1);
				this.comments.set(contentPath, comments);
				return true;
			}
		}
		return false;
	}

	getComments(contentPath: string): Comment[] {
		return this.comments.get(contentPath) || [];
	}

	getComment(commentId: string): Comment | null {
		for (const comments of this.comments.values()) {
			const comment = comments.find(c => c.id === commentId);
			if (comment) return comment;
		}
		return null;
	}
}

let instance: CommentManager | null = null;

export function getCommentManager(): CommentManager {
	if (!instance) {
		instance = new CommentManager();
	}
	return instance;
}
