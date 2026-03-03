import type { Activity, SharedItem, Team, TeamMember } from "#shared/types/collaboration";
import { computed, ref } from "vue";

export function useCollaboration() {
	const teams = ref<Team[]>([]);
	const teamMembers = ref<TeamMember[]>([]);
	const activities = ref<Activity[]>([]);
	const sharedItems = ref<SharedItem[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const activeMembers = computed(() => teamMembers.value.filter((m) => ["owner", "admin", "member"].includes(m.role)));
	const recentActivities = computed(() => activities.value.slice(0, 20));

	const fetchTeams = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ teams: Team[] }>("/api/team");
			teams.value = response.teams;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch teams";
		} finally {
			loading.value = false;
		}
	};

	const fetchTeamMembers = async (teamId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ members: TeamMember[] }>(`/api/team/${teamId}/members`);
			teamMembers.value = response.members;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch team members";
		} finally {
			loading.value = false;
		}
	};

	const fetchActivities = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ activities: Activity[] }>("/api/team/activity");
			activities.value = response.activities;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch activities";
		} finally {
			loading.value = false;
		}
	};

	const fetchSharedItems = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ shared: SharedItem[] }>("/api/shared");
			sharedItems.value = response.shared;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to fetch shared items";
		} finally {
			loading.value = false;
		}
	};

	const inviteMember = async (teamId: string, email: string, role: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ member: TeamMember }>(`/api/team/${teamId}/members`, {
				method: "POST",
				body: { email, role },
			});
			teamMembers.value.push(response.member);
			return response.member;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to invite member";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const updateMemberRole = async (teamId: string, memberId: string, role: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ member: TeamMember }>(`/api/team/${teamId}/members/${memberId}`, {
				method: "PUT",
				body: { role },
			});
			const index = teamMembers.value.findIndex((m) => m.userId === memberId);
			if (index !== -1) {
				teamMembers.value[index] = response.member;
			}
			return response.member;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to update member role";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const removeMember = async (teamId: string, memberId: string) => {
		loading.value = true;
		error.value = null;
		try {
			await $fetch(`/api/team/${teamId}/members/${memberId}`, {
				method: "DELETE",
			});
			teamMembers.value = teamMembers.value.filter((m) => m.userId !== memberId);
			return true;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to remove member";
			return false;
		} finally {
			loading.value = false;
		}
	};

	const shareItem = async (
		entityType: "project" | "media",
		entityId: string,
		entityName: string,
		sharedWith: string,
		permission: "view" | "edit" | "admin",
	) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await $fetch<{ shared: SharedItem }>("/api/shared", {
				method: "POST",
				body: { entityType, entityId, entityName, sharedWith, permission },
			});
			sharedItems.value.unshift(response.shared);
			return response.shared;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to share item";
			return null;
		} finally {
			loading.value = false;
		}
	};

	const unshareItem = async (sharedId: string) => {
		loading.value = true;
		error.value = null;
		try {
			await $fetch(`/api/shared/${sharedId}`, {
				method: "DELETE",
			});
			sharedItems.value = sharedItems.value.filter((s) => s.id !== sharedId);
			return true;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to unshare item";
			return false;
		} finally {
			loading.value = false;
		}
	};

	return {
		teams,
		teamMembers,
		activities,
		sharedItems,
		activeMembers,
		recentActivities,
		loading,
		error,
		fetchTeams,
		fetchTeamMembers,
		fetchActivities,
		fetchSharedItems,
		inviteMember,
		updateMemberRole,
		removeMember,
		shareItem,
		unshareItem,
	};
}
