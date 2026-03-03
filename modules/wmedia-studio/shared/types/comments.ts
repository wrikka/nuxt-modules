export interface CanvasComment {
	id: string;
	text: string;
	author: {
		id: string;
		name: string;
		avatar: string;
	};
	timestamp: Date;
	position?: {
		x: number;
		y: number;
	};
	elementId?: string;
	isResolved: boolean;
	replies: CanvasCommentReply[];
	attachments?: string[];
}

export interface CanvasCommentReply {
	id: string;
	text: string;
	author: {
		id: string;
		name: string;
		avatar: string;
	};
	timestamp: Date;
}
