export interface Comment {
	id: string;
	contentPath: string;
	authorId: string;
	authorName: string;
	content: string;
	createdAt: number;
	createdAtISO: string;
	parentId?: string;
}

export interface CommentResult {
	success: boolean;
	comment?: Comment;
	error?: string;
}
