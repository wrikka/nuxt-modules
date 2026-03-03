// import type { ContentItem } from "../../../shared/types";

export interface Comment {
	id: string;
	_path: string;
	__userId: string;
	userName: string;
	content: string;
	createdAt: string;
	parentId?: string;
	status: "pending" | "approved" | "rejected";
	likes: number;
	replies: Comment[];
}

export interface Discussion {
	_path: string;
	comments: Comment[];
	stats: {
		total: number;
		approved: number;
		pending: number;
	};
}

export class ContentComments {
	private comments: Map<string, Discussion> = new Map();

	addComment(
		_path: string,
		__userId: string,
		userName: string,
		content: string,
		parentId?: string,
	): Comment {
		const discussion = this.getOrCreateDiscussion(_path);
		const comment: Comment = {
			id: this.generateId(),
			_path,
			__userId,
			userName,
			content,
			createdAt: new Date().toISOString(),
			parentId,
			status: "pending",
			likes: 0,
			replies: [],
		};

		if (parentId) {
			const parent = this.findComment(discussion.comments, parentId);
			if (parent) {
				parent.replies.push(comment);
			} else {
				discussion.comments.push(comment);
			}
		} else {
			discussion.comments.push(comment);
		}

		this.updateStats(discussion);

		return comment;
	}

	getComments(_path: string, status?: "pending" | "approved" | "rejected"): Comment[] {
		const discussion = this.comments.get(_path);
		if (!discussion) return [];

		if (status) {
			return this.filterByStatus(discussion.comments, status);
		}

		return discussion.comments;
	}

	getComment(commentId: string): Comment | null {
		for (const discussion of this.comments.values()) {
			const comment = this.findComment(discussion.comments, commentId);
			if (comment) return comment;
		}
		return null;
	}

	approveComment(commentId: string): boolean {
		const comment = this.getComment(commentId);
		if (!comment) return false;

		comment.status = "approved";
		this.updateStats(this.getOrCreateDiscussion(comment._path));

		return true;
	}

	rejectComment(commentId: string): boolean {
		const comment = this.getComment(commentId);
		if (!comment) return false;

		comment.status = "rejected";
		this.updateStats(this.getOrCreateDiscussion(comment._path));

		return true;
	}

	deleteComment(commentId: string): boolean {
		for (const [_path, discussion] of this.comments.entries()) {
			const index = this.findCommentIndex(discussion.comments, commentId);
			if (index !== -1) {
				discussion.comments.splice(index, 1);
				this.updateStats(discussion);
				return true;
			}
		}
		return false;
	}

	likeComment(commentId: string, __userId: string): boolean {
		const comment = this.getComment(commentId);
		if (!comment) return false;

		comment.likes++;
		return true;
	}

	getDiscussion(_path: string): Discussion | null {
		return this.comments.get(_path) || null;
	}

	getUserComments(__userId: string): Comment[] {
		const comments: Comment[] = [];

		for (const discussion of this.comments.values()) {
			this.collectUserComments(discussion.comments, __userId, comments);
		}

		return comments;
	}

	private getOrCreateDiscussion(_path: string): Discussion {
		let discussion = this.comments.get(_path);

		if (!discussion) {
			discussion = {
				_path,
				comments: [],
				stats: {
					total: 0,
					approved: 0,
					pending: 0,
				},
			};
			this.comments.set(_path, discussion);
		}

		return discussion;
	}

	private findComment(comments: Comment[], id: string): Comment | null {
		for (const comment of comments) {
			if (comment.id === id) return comment;
			if (comment.replies.length > 0) {
				const found = this.findComment(comment.replies, id);
				if (found) return found;
			}
		}
		return null;
	}

	private findCommentIndex(comments: Comment[], id: string): number {
		for (let i = 0; i < comments.length; i++) {
			if (comments[i].id === id) return i;
			if (comments[i].replies.length > 0) {
				const index = this.findCommentIndex(comments[i].replies, id);
				if (index !== -1) return index;
			}
		}
		return -1;
	}

	private filterByStatus(comments: Comment[], status: "pending" | "approved" | "rejected"): Comment[] {
		const filtered: Comment[] = [];

		for (const comment of comments) {
			if (comment.status === status) {
				filtered.push(comment);
			}
			if (comment.replies.length > 0) {
				filtered.push(...this.filterByStatus(comment.replies, status));
			}
		}

		return filtered;
	}

	private collectUserComments(comments: Comment[], __userId: string, result: Comment[]): void {
		for (const comment of comments) {
			if (comment.__userId === __userId) {
				result.push(comment);
			}
			if (comment.replies.length > 0) {
				this.collectUserComments(comment.replies, __userId, result);
			}
		}
	}

	private updateStats(discussion: Discussion): void {
		const allComments = this.getAllComments(discussion.comments);

		discussion.stats = {
			total: allComments.length,
			approved: allComments.filter((c) => c.status === "approved").length,
			pending: allComments.filter((c) => c.status === "pending").length,
		};
	}

	private getAllComments(comments: Comment[]): Comment[] {
		const all: Comment[] = [];

		for (const comment of comments) {
			all.push(comment);
			if (comment.replies.length > 0) {
				all.push(...this.getAllComments(comment.replies));
			}
		}

		return all;
	}

	private generateId(): string {
		return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	getStats() {
		const allDiscussions = Array.from(this.comments.values());

		return {
			totalDiscussions: allDiscussions.length,
			totalComments: allDiscussions.reduce((sum, d) => sum + d.stats.total, 0),
			totalApproved: allDiscussions.reduce((sum, d) => sum + d.stats.approved, 0),
			totalPending: allDiscussions.reduce((sum, d) => sum + d.stats.pending, 0),
		};
	}
}

let commentsInstance: ContentComments | null = null;

export function getContentComments(): ContentComments {
	if (!commentsInstance) {
		commentsInstance = new ContentComments();
	}
	return commentsInstance;
}
