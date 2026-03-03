import { computed, ref } from "vue";

export interface Mention {
	id: string;
	userId: string;
	userName: string;
	mentionedBy: string;
	mentionedByUserName: string;
	projectId?: string;
	commentId?: string;
	message: string;
	isRead: boolean;
	createdAt: Date;
}

export interface MentionableUser {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

export function useMentions(projectId?: Ref<string>) {
	const mentions = ref<Mention[]>([]);
	const mentionableUsers = ref<MentionableUser[]>([]);
	const isLoading = ref(false);

	const unreadMentions = computed(() => {
		return mentions.value.filter(m => !m.isRead);
	});

	const loadMentions = async () => {
		isLoading.value = true;
		try {
			const params = projectId ? { projectId: projectId.value } : {};
			const data = await $fetch<{ mentions: Mention[] }>("/api/mentions", { params });
			mentions.value = data.mentions || [];
		} catch (error) {
			console.error("Failed to load mentions:", error);
			mentions.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const createMention = async (userId: string, message: string, commentId?: string) => {
		try {
			const result = await $fetch<{ mention: Mention }>("/api/mentions", {
				method: "POST",
				body: {
					userId,
					projectId: projectId?.value,
					commentId,
					message,
				},
			});

			mentions.value.unshift(result.mention);
			return result.mention;
		} catch (error) {
			console.error("Failed to create mention:", error);
			return null;
		}
	};

	const markAsRead = async (mentionId: string) => {
		try {
			await $fetch(`/api/mentions/${mentionId}/read`, {
				method: "POST",
			});

			const mention = mentions.value.find(m => m.id === mentionId);
			if (mention) {
				mention.isRead = true;
			}
		} catch (error) {
			console.error("Failed to mark mention as read:", error);
		}
	};

	const markAllAsRead = async () => {
		try {
			await $fetch("/api/mentions/read-all", {
				method: "POST",
			});

			mentions.value.forEach(m => m.isRead = true);
		} catch (error) {
			console.error("Failed to mark all mentions as read:", error);
		}
	};

	const deleteMention = async (mentionId: string) => {
		try {
			await $fetch(`/api/mentions/${mentionId}`, {
				method: "DELETE",
			});

			mentions.value = mentions.value.filter(m => m.id !== mentionId);
		} catch (error) {
			console.error("Failed to delete mention:", error);
		}
	};

	const loadMentionableUsers = async (projectId?: string) => {
		try {
			const params = projectId ? { projectId } : {};
			const data = await $fetch<{ users: MentionableUser[] }>("/api/users/mentionable", { params });
			mentionableUsers.value = data.users || [];
		} catch (error) {
			console.error("Failed to load mentionable users:", error);
			mentionableUsers.value = [];
		}
	};

	const searchUsers = (query: string) => {
		const lowerQuery = query.toLowerCase();
		return mentionableUsers.value.filter(user =>
			user.name.toLowerCase().includes(lowerQuery)
			|| user.email.toLowerCase().includes(lowerQuery)
		);
	};

	const parseMentions = (text: string): MentionableUser[] => {
		const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
		const matches = text.match(mentionRegex) || [];
		const mentionedUsers: MentionableUser[] = [];

		matches.forEach(match => {
			const userName = match.substring(1);
			const user = mentionableUsers.value.find(u => u.name.toLowerCase() === userName.toLowerCase());
			if (user) {
				mentionedUsers.push(user);
			}
		});

		return mentionedUsers;
	};

	const createMentionsFromText = async (text: string, commentId?: string) => {
		const mentionedUsers = parseMentions(text);
		const promises = mentionedUsers.map(user => createMention(user.id, text, commentId));
		return Promise.all(promises);
	};

	const formatMentionText = (text: string): string => {
		return text.replace(/@(\w+(?:\s+\w+)*)/g, "<span class=\"mention\">@$1</span>");
	};

	const getMentionsByProject = (projectId: string) => {
		return mentions.value.filter(m => m.projectId === projectId);
	};

	const getMentionsByUser = (userId: string) => {
		return mentions.value.filter(m => m.userId === userId);
	};

	return {
		mentions,
		unreadMentions,
		mentionableUsers,
		isLoading,
		loadMentions,
		createMention,
		markAsRead,
		markAllAsRead,
		deleteMention,
		loadMentionableUsers,
		searchUsers,
		parseMentions,
		createMentionsFromText,
		formatMentionText,
		getMentionsByProject,
		getMentionsByUser,
	};
}
