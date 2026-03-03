import type { SocialMediaPlatform } from "#shared/types/api";
import { computed, ref } from "vue";

export interface ScheduledPost {
	id: string;
	projectId: string;
	platform: SocialMediaPlatform["id"];
	content: {
		image?: string;
		video?: string;
		caption: string;
		hashtags?: string[];
	};
	scheduledAt: Date;
	status: "scheduled" | "posted" | "failed" | "cancelled";
	postedAt?: Date;
	error?: string;
	createdAt: Date;
}

export const SOCIAL_PLATFORMS: SocialMediaPlatform[] = [
	{
		id: "facebook",
		name: "Facebook",
		icon: "facebook",
		supportedFormats: ["png", "jpg", "jpeg", "mp4"],
		maxFileSize: 10 * 1024 * 1024,
		maxCaptionLength: 63206,
		requiresApproval: false,
	},
	{
		id: "instagram",
		name: "Instagram",
		icon: "instagram",
		supportedFormats: ["png", "jpg", "jpeg", "mp4"],
		maxFileSize: 10 * 1024 * 1024,
		maxCaptionLength: 2200,
		requiresApproval: true,
	},
	{
		id: "twitter",
		name: "Twitter",
		icon: "twitter",
		supportedFormats: ["png", "jpg", "jpeg", "mp4", "gif"],
		maxFileSize: 5 * 1024 * 1024,
		maxCaptionLength: 280,
		requiresApproval: false,
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: "linkedin",
		supportedFormats: ["png", "jpg", "jpeg", "mp4"],
		maxFileSize: 5 * 1024 * 1024,
		maxCaptionLength: 3000,
		requiresApproval: false,
	},
	{
		id: "pinterest",
		name: "Pinterest",
		icon: "pinterest",
		supportedFormats: ["png", "jpg", "jpeg"],
		maxFileSize: 10 * 1024 * 1024,
		maxCaptionLength: 500,
		requiresApproval: false,
	},
	{
		id: "tiktok",
		name: "TikTok",
		icon: "tiktok",
		supportedFormats: ["mp4", "mov"],
		maxFileSize: 100 * 1024 * 1024,
		maxCaptionLength: 150,
		requiresApproval: true,
	},
];

export function useSocialMediaScheduling(projectId: Ref<string>) {
	const scheduledPosts = ref<ScheduledPost[]>([]);
	const isLoading = ref(false);

	const upcomingPosts = computed(() => {
		const now = new Date();
		return scheduledPosts.value
			.filter(p => p.status === "scheduled" && new Date(p.scheduledAt) > now)
			.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
	});

	const pastPosts = computed(() => {
		const now = new Date();
		return scheduledPosts.value
			.filter(p => new Date(p.scheduledAt) <= now)
			.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
	});

	const loadScheduledPosts = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ posts: ScheduledPost[] }>(`/api/projects/${projectId.value}/scheduled-posts`);
			scheduledPosts.value = data.posts || [];
		} catch (error) {
			console.error("Failed to load scheduled posts:", error);
			scheduledPosts.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const schedulePost = async (
		platform: SocialMediaPlatform["id"],
		content: ScheduledPost["content"],
		scheduledAt: Date,
	) => {
		try {
			const result = await $fetch<{ post: ScheduledPost }>(`/api/projects/${projectId.value}/scheduled-posts`, {
				method: "POST",
				body: {
					platform,
					content,
					scheduledAt: scheduledAt.toISOString(),
				},
			});

			scheduledPosts.value.push(result.post);
			return result.post;
		} catch (error) {
			console.error("Failed to schedule post:", error);
			return null;
		}
	};

	const updateScheduledPost = async (postId: string, updates: Partial<ScheduledPost>) => {
		try {
			const result = await $fetch<{ post: ScheduledPost }>(
				`/api/projects/${projectId.value}/scheduled-posts/${postId}`,
				{
					method: "PATCH",
					body: updates,
				},
			);

			const index = scheduledPosts.value.findIndex(p => p.id === postId);
			if (index >= 0) {
				scheduledPosts.value[index] = result.post;
			}

			return result.post;
		} catch (error) {
			console.error("Failed to update scheduled post:", error);
			return null;
		}
	};

	const cancelScheduledPost = async (postId: string) => {
		return updateScheduledPost(postId, { status: "cancelled" });
	};

	const deleteScheduledPost = async (postId: string) => {
		try {
			await $fetch(`/api/projects/${projectId.value}/scheduled-posts/${postId}`, {
				method: "DELETE",
			});

			scheduledPosts.value = scheduledPosts.value.filter(p => p.id !== postId);
			return true;
		} catch (error) {
			console.error("Failed to delete scheduled post:", error);
			return false;
		}
	};

	const postNow = async (postId: string) => {
		try {
			const result = await $fetch<{ post: ScheduledPost }>(
				`/api/projects/${projectId.value}/scheduled-posts/${postId}/post-now`,
				{
					method: "POST",
				},
			);

			const index = scheduledPosts.value.findIndex(p => p.id === postId);
			if (index >= 0) {
				scheduledPosts.value[index] = result.post;
			}

			return result.post;
		} catch (error) {
			console.error("Failed to post now:", error);
			return null;
		}
	};

	const getPostsByPlatform = (platform: SocialMediaPlatform["id"]) => {
		return scheduledPosts.value.filter(p => p.platform === platform);
	};

	const getPostsByStatus = (status: ScheduledPost["status"]) => {
		return scheduledPosts.value.filter(p => p.status === status);
	};

	const getPlatform = (platformId: SocialMediaPlatform["id"]) => {
		return SOCIAL_PLATFORMS.find(p => p.id === platformId);
	};

	const validateCaption = (
		platform: SocialMediaPlatform["id"],
		caption: string,
	): { valid: boolean; error?: string } => {
		const platformData = getPlatform(platform);
		if (!platformData) {
			return { valid: false, error: "Invalid platform" };
		}

		if (platformData.maxCaptionLength && caption.length > platformData.maxCaptionLength) {
			return {
				valid: false,
				error: `Caption exceeds maximum length of ${platformData.maxCaptionLength} characters`,
			};
		}

		return { valid: true };
	};

	return {
		scheduledPosts,
		upcomingPosts,
		pastPosts,
		isLoading,
		loadScheduledPosts,
		schedulePost,
		updateScheduledPost,
		cancelScheduledPost,
		deleteScheduledPost,
		postNow,
		getPostsByPlatform,
		getPostsByStatus,
		getPlatform,
		validateCaption,
	};
}
