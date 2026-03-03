import { useRuntimeConfig } from "#imports";
import type { Collaboration, Comment, CursorPosition, Selection } from "#shared/types";
import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { ref } from "vue";

export const useCollaborationStore = defineStore("collaboration", () => {
	const socket = ref<Socket | null>(null);
	const collaborators = ref<Map<string, Collaboration>>(new Map());
	const comments = ref<Comment[]>([]);
	const connected = ref(false);
	const userId = ref("");
	const userName = ref("");

	const connect = (projectId: string) => {
		if (socket.value?.connected) {
			return;
		}

		const config = useRuntimeConfig();
		socket.value = io(config.public.wsUrl, {
			query: { projectId },
		});

		socket.value.on("connect", () => {
			connected.value = true;
			console.log("Connected to collaboration server");
		});

		socket.value.on("disconnect", () => {
			connected.value = false;
			console.log("Disconnected from collaboration server");
		});

		socket.value.on("user:joined", (data: Collaboration) => {
			collaborators.value.set(data.userId, data);
		});

		socket.value.on("user:left", (data: { userId: string }) => {
			collaborators.value.delete(data.userId);
		});

		socket.value.on("cursor:move", (data: { userId: string; cursor: CursorPosition }) => {
			const collaborator = collaborators.value.get(data.userId);
			if (collaborator) {
				collaborator.cursor = data.cursor;
			}
		});

		socket.value.on("selection:change", (data: { userId: string; selection: Selection }) => {
			const collaborator = collaborators.value.get(data.userId);
			if (collaborator) {
				collaborator.selection = data.selection;
			}
		});

		socket.value.on("comment:add", (comment: Comment) => {
			comments.value.push(comment);
		});

		socket.value.on("comment:update", (comment: Comment) => {
			const index = comments.value.findIndex((c) => c.id === comment.id);
			if (index !== -1) {
				comments.value[index] = comment;
			}
		});

		socket.value.on("comment:delete", (data: { commentId: string }) => {
			comments.value = comments.value.filter((c) => c.id !== data.commentId);
		});
	};

	const disconnect = () => {
		if (socket.value) {
			socket.value.disconnect();
			socket.value = null;
			connected.value = false;
			collaborators.value.clear();
			comments.value = [];
		}
	};

	const sendCursorPosition = (cursor: CursorPosition) => {
		if (socket.value?.connected) {
			socket.value.emit("cursor:move", cursor);
		}
	};

	const sendSelection = (selection: Selection) => {
		if (socket.value?.connected) {
			socket.value.emit("selection:change", selection);
		}
	};

	const addComment = async (comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "replies">) => {
		if (socket.value?.connected) {
			socket.value.emit("comment:add", comment);
		}
	};

	const updateComment = async (commentId: string, content: string) => {
		if (socket.value?.connected) {
			socket.value.emit("comment:update", { commentId, content });
		}
	};

	const deleteComment = async (commentId: string) => {
		if (socket.value?.connected) {
			socket.value.emit("comment:delete", { commentId });
		}
	};

	const resolveComment = async (commentId: string) => {
		const comment = comments.value.find((c) => c.id === commentId);
		if (comment) {
			comment.resolved = true;
			if (socket.value?.connected) {
				socket.value.emit("comment:update", comment);
			}
		}
	};

	const addReply = async (commentId: string, reply: Omit<Comment["replies"][number], "id" | "createdAt">) => {
		const comment = comments.value.find((c) => c.id === commentId);
		if (comment) {
			comment.replies.push({
				...reply,
				id: crypto.randomUUID(),
				createdAt: new Date(),
			});
			if (socket.value?.connected) {
				socket.value.emit("comment:update", comment);
			}
		}
	};

	return {
		socket,
		collaborators,
		comments,
		connected,
		userId,
		userName,
		connect,
		disconnect,
		sendCursorPosition,
		sendSelection,
		addComment,
		updateComment,
		deleteComment,
		resolveComment,
		addReply,
	};
});
