export interface CollaborationConfig {
	enableRealTime: boolean;
	enableComments: boolean;
	enableSuggestions: boolean;
}

export interface Comment {
	id: string;
	contentId: string;
	author: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
	parentId?: string;
}

export interface Suggestion {
	id: string;
	contentId: string;
	author: string;
	type: "addition" | "deletion" | "modification";
	content: string;
	position?: { start: number; end: number };
	status: "pending" | "accepted" | "rejected";
	createdAt: string;
}

export class ContentCollaboration {
	private config: CollaborationConfig;
	private comments: Map<string, Comment[]> = new Map();
	private suggestions: Map<string, Suggestion[]> = new Map();

	constructor(config?: CollaborationConfig) {
		this.config = config || {
			enableRealTime: true,
			enableComments: true,
			enableSuggestions: true,
		};
	}

	addComment(contentId: string, author: string, content: string, parentId?: string): Comment {
		if (!this.config.enableComments) {
			throw new Error("Comments are not enabled");
		}

		const comment: Comment = {
			id: crypto.randomUUID(),
			contentId,
			author,
			content,
			createdAt: new Date().toISOString(),
			parentId,
		};

		if (!this.comments.has(contentId)) {
			this.comments.set(contentId, []);
		}

		this.comments.get(contentId)!.push(comment);
		return comment;
	}

	updateComment(commentId: string, content: string): Comment | null {
		for (const comments of this.comments.values()) {
			const comment = comments.find((c) => c.id === commentId);
			if (comment) {
				comment.content = content;
				comment.updatedAt = new Date().toISOString();
				return comment;
			}
		}

		return null;
	}

	deleteComment(commentId: string): boolean {
		for (const comments of this.comments.values()) {
			const index = comments.findIndex((c) => c.id === commentId);
			if (index !== -1) {
				comments.splice(index, 1);
				return true;
			}
		}

		return false;
	}

	getComments(contentId: string): Comment[] {
		return this.comments.get(contentId) || [];
	}

	getComment(commentId: string): Comment | null {
		for (const comments of this.comments.values()) {
			const comment = comments.find((c) => c.id === commentId);
			if (comment) return comment;
		}

		return null;
	}

	addSuggestion(
		contentId: string,
		author: string,
		type: "addition" | "deletion" | "modification",
		content: string,
		position?: { start: number; end: number },
	): Suggestion {
		if (!this.config.enableSuggestions) {
			throw new Error("Suggestions are not enabled");
		}

		const suggestion: Suggestion = {
			id: crypto.randomUUID(),
			contentId,
			author,
			type,
			content,
			position,
			status: "pending",
			createdAt: new Date().toISOString(),
		};

		if (!this.suggestions.has(contentId)) {
			this.suggestions.set(contentId, []);
		}

		this.suggestions.get(contentId)!.push(suggestion);
		return suggestion;
	}

	acceptSuggestion(suggestionId: string): Suggestion | null {
		const suggestion = this.findSuggestion(suggestionId);
		if (suggestion) {
			suggestion.status = "accepted";
			return suggestion;
		}

		return null;
	}

	rejectSuggestion(suggestionId: string): Suggestion | null {
		const suggestion = this.findSuggestion(suggestionId);
		if (suggestion) {
			suggestion.status = "rejected";
			return suggestion;
		}

		return null;
	}

	getSuggestions(contentId: string, status?: "pending" | "accepted" | "rejected"): Suggestion[] {
		const suggestions = this.suggestions.get(contentId) || [];

		if (status) {
			return suggestions.filter((s) => s.status === status);
		}

		return suggestions;
	}

	private findSuggestion(suggestionId: string): Suggestion | null {
		for (const suggestions of this.suggestions.values()) {
			const suggestion = suggestions.find((s) => s.id === suggestionId);
			if (suggestion) return suggestion;
		}

		return null;
	}

	getPendingSuggestions(contentId: string): Suggestion[] {
		return this.getSuggestions(contentId, "pending");
	}

	getAcceptedSuggestions(contentId: string): Suggestion[] {
		return this.getSuggestions(contentId, "accepted");
	}

	getRejectedSuggestions(contentId: string): Suggestion[] {
		return this.getSuggestions(contentId, "rejected");
	}

	clearContent(contentId: string): void {
		this.comments.delete(contentId);
		this.suggestions.delete(contentId);
	}

	getAllComments(): Map<string, Comment[]> {
		return new Map(this.comments);
	}

	getAllSuggestions(): Map<string, Suggestion[]> {
		return new Map(this.suggestions);
	}

	getConfig(): CollaborationConfig {
		return this.config;
	}
}

// Singleton instance
let collaborationInstance: ContentCollaboration | null = null;

export function useContentCollaboration(config?: CollaborationConfig): ContentCollaboration {
	if (!collaborationInstance) {
		collaborationInstance = new ContentCollaboration(config);
	}
	return collaborationInstance;
}

// Helper composable for collaboration
export function useCollaboration(contentId: string) {
	const collaboration = useContentCollaboration();

	return {
		addComment: (author: string, content: string, parentId?: string) =>
			collaboration.addComment(contentId, author, content, parentId),
		updateComment: (commentId: string, content: string) => collaboration.updateComment(commentId, content),
		deleteComment: (commentId: string) => collaboration.deleteComment(commentId),
		getComments: () => collaboration.getComments(contentId),
		getComment: (commentId: string) => collaboration.getComment(commentId),
		addSuggestion: (
			author: string,
			type: "addition" | "deletion" | "modification",
			content: string,
			position?: { start: number; end: number },
		) => collaboration.addSuggestion(contentId, author, type, content, position),
		acceptSuggestion: (suggestionId: string) => collaboration.acceptSuggestion(suggestionId),
		rejectSuggestion: (suggestionId: string) => collaboration.rejectSuggestion(suggestionId),
		getSuggestions: (status?: "pending" | "accepted" | "rejected") => collaboration.getSuggestions(contentId, status),
		getPendingSuggestions: () => collaboration.getPendingSuggestions(contentId),
		getAcceptedSuggestions: () => collaboration.getAcceptedSuggestions(contentId),
		getRejectedSuggestions: () => collaboration.getRejectedSuggestions(contentId),
		clearContent: () => collaboration.clearContent(contentId),
	};
}
