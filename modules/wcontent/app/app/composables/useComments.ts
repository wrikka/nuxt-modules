import type { Comment, CommentResult } from "../../shared/types/comments";

export function useComments() {
	const addComment = async (
		contentPath: string,
		authorId: string,
		authorName: string,
		content: string,
		parentId?: string,
	): Promise<CommentResult> => {
		const response = await $fetch("/api/comments/add", {
			method: "POST",
			body: { contentPath, authorId, authorName, content, parentId },
		});
		return response as CommentResult;
	};

	const getComments = async (contentPath: string): Promise<Comment[]> => {
		const response = await $fetch("/api/comments/list", {
			method: "GET",
			query: { path: contentPath },
		});
		return response as Comment[];
	};

	return {
		addComment,
		getComments,
	};
}
