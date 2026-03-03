export interface ShareLink {
	id: string;
	projectId: string;
	shareToken: string;
	permission: "view" | "edit" | "comment";
	expiresAt?: Date;
	createdAt: Date;
	createdBy: string;
	url: string;
	viewCount: number;
}

export interface ShareConfig {
	allowComments: boolean;
	allowDownload: boolean;
	password?: string;
	expiresAt?: Date;
	maxViews?: number;
}

export function useProjectSharing(projectId: Ref<string>) {
	const shareLinks = ref<ShareLink[]>([]);
	const isLoading = ref(false);

	const hasActiveLinks = computed(() => shareLinks.value.some(link => !link.expiresAt || link.expiresAt > new Date()));

	const createShareLink = async (permission: "view" | "edit" | "comment", config?: Partial<ShareConfig>) => {
		try {
			const result = await $fetch<{ shareLink: ShareLink }>(`/api/projects/${projectId.value}/shares`, {
				method: "POST",
				body: {
					permission,
					config,
				},
			});

			shareLinks.value.push(result.shareLink);
			return result.shareLink;
		} catch (error) {
			console.error("Failed to create share link:", error);
			return null;
		}
	};

	const getShareLink = async (shareToken: string) => {
		try {
			const result = await $fetch<{ shareLink: ShareLink }>(`/api/projects/${projectId.value}/shares/${shareToken}`);
			return result.shareLink;
		} catch (error) {
			console.error("Failed to get share link:", error);
			return null;
		}
	};

	const updateShareLink = async (shareLinkId: string, updates: Partial<ShareLink>) => {
		try {
			const result = await $fetch<{ shareLink: ShareLink }>(`/api/projects/${projectId.value}/shares/${shareLinkId}`, {
				method: "PATCH",
				body: updates,
			});

			const index = shareLinks.value.findIndex(l => l.id === shareLinkId);
			if (index >= 0) {
				shareLinks.value[index] = result.shareLink;
			}

			return result.shareLink;
		} catch (error) {
			console.error("Failed to update share link:", error);
			return null;
		}
	};

	const deleteShareLink = async (shareLinkId: string) => {
		try {
			await $fetch(`/api/projects/${projectId.value}/shares/${shareLinkId}`, {
				method: "DELETE",
			});

			shareLinks.value = shareLinks.value.filter(l => l.id !== shareLinkId);
			return true;
		} catch (error) {
			console.error("Failed to delete share link:", error);
			return false;
		}
	};

	const revokeShareLink = async (shareLinkId: string) => {
		return deleteShareLink(shareLinkId);
	};

	const loadShareLinks = async () => {
		isLoading.value = true;
		try {
			const result = await $fetch<{ shareLinks: ShareLink[] }>(`/api/projects/${projectId.value}/shares`);
			shareLinks.value = result.shareLinks || [];
		} catch (error) {
			console.error("Failed to load share links:", error);
			shareLinks.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const getActiveShareLinks = () => {
		const now = new Date();
		return shareLinks.value.filter(link => !link.expiresAt || link.expiresAt > now);
	};

	const getExpiredShareLinks = () => {
		const now = new Date();
		return shareLinks.value.filter(link => link.expiresAt && link.expiresAt <= now);
	};

	const generateShareUrl = (shareToken: string) => {
		return `${window.location.origin}/shared/${shareToken}`;
	};

	const copyShareLink = async (shareToken: string) => {
		const url = generateShareUrl(shareToken);
		try {
			await navigator.clipboard.writeText(url);
			return true;
		} catch (error) {
			console.error("Failed to copy share link:", error);
			return false;
		}
	};

	const incrementViewCount = async (shareLinkId: string) => {
		try {
			await $fetch(`/api/projects/${projectId.value}/shares/${shareLinkId}/view`, {
				method: "POST",
			});

			const link = shareLinks.value.find(l => l.id === shareLinkId);
			if (link) {
				link.viewCount++;
			}
		} catch (error) {
			console.error("Failed to increment view count:", error);
		}
	};

	const checkSharePermission = async (shareToken: string): Promise<"view" | "edit" | "comment" | null> => {
		try {
			const result = await $fetch<{ permission: "view" | "edit" | "comment" }>(`/api/shared/${shareToken}/permission`);
			return result.permission;
		} catch (error) {
			console.error("Failed to check share permission:", error);
			return null;
		}
	};

	const getSharedProject = async (shareToken: string) => {
		try {
			const result = await $fetch<{ project: any }>(`/api/shared/${shareToken}`);
			return result.project;
		} catch (error) {
			console.error("Failed to get shared project:", error);
			return null;
		}
	};

	const shareWithEmail = async (emails: string[], permission: "view" | "edit" | "comment", message?: string) => {
		try {
			const result = await $fetch<{ success: boolean }>(`/api/projects/${projectId.value}/share-email`, {
				method: "POST",
				body: {
					emails,
					permission,
					message,
				},
			});

			return result.success;
		} catch (error) {
			console.error("Failed to share with email:", error);
			return false;
		}
	};

	return {
		shareLinks,
		isLoading,
		hasActiveLinks,
		createShareLink,
		getShareLink,
		updateShareLink,
		deleteShareLink,
		revokeShareLink,
		loadShareLinks,
		getActiveShareLinks,
		getExpiredShareLinks,
		generateShareUrl,
		copyShareLink,
		incrementViewCount,
		checkSharePermission,
		getSharedProject,
		shareWithEmail,
	};
}
