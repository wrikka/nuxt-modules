export interface Collaboration {
	id: string;
	projectId: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	cursor?: CursorPosition;
	selection?: Selection;
	status: "active" | "idle";
	lastActiveAt: Date;
}

export interface CursorPosition {
	x: number;
	y: number;
}

export interface Selection {
	elementId: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Comment {
	id: string;
	projectId: string;
	elementId?: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	content: string;
	x: number;
	y: number;
	resolved: boolean;
	createdAt: Date;
	updatedAt: Date;
	replies: CommentReply[];
}

export interface CommentReply {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	content: string;
	createdAt: Date;
}

export interface Workspace {
	id: string;
	name: string;
	description?: string;
	ownerId: string;
	members: WorkspaceMember[];
	projects: string[];
	brandKits: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface WorkspaceMember {
	userId: string;
	userName: string;
	userAvatar?: string;
	role: "owner" | "admin" | "editor" | "viewer";
	joinedAt: Date;
}

export interface Team {
	id: string;
	name: string;
	description?: string;
	ownerId: string;
	members: TeamMember[];
	workspaces: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface TeamMember {
	userId: string;
	userName: string;
	userAvatar?: string;
	role: "owner" | "admin" | "member";
	joinedAt: Date;
}

export interface Activity {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	action: string;
	entityType: "project" | "media" | "comment";
	entityId: string;
	entityName: string;
	createdAt: Date;
	metadata?: Record<string, unknown>;
}

export interface SharedItem {
	id: string;
	userId: string;
	sharedBy: string;
	sharedWith: string;
	entityType: "project" | "media";
	entityId: string;
	entityName: string;
	permission: "view" | "edit" | "admin";
	createdAt: Date;
	expiresAt?: Date;
}
