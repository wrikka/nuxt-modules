import { useRuntimeConfig } from '#imports';
import { computed, ref } from 'vue';
import type {
  Team,
  TeamActivity,
  TeamConfig,
  TeamInvitation,
  TeamMember,
  TeamRole,
  TeamSettings,
} from '#analytics/types';

export const useTeam = () => {
  const config = useRuntimeConfig();
  const teamConfig = (config.public.analytics as { team: TeamConfig; }).team;

  const teams = ref<Team[]>([]);
  const currentTeam = ref<Team | null>(null);
  const members = ref<TeamMember[]>([]);
  const invitations = ref<TeamInvitation[]>([]);
  const activities = ref<TeamActivity[]>([]);
  const isLoading = ref(false);

  const isEnabled = computed(() => teamConfig.enabled);

  const createTeam = (name: string, settings?: Partial<TeamSettings>): Team | null => {
    if (!isEnabled.value) return null;
    if (teams.value.length >= teamConfig.maxSites) return null;

    const team: Team = {
      id: crypto.randomUUID(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      ownerId: 'current-user',
      members: [],
      invitations: [],
      sites: [],
      settings: {
        allowGuests: teamConfig.allowGuests,
        requireInvitation: teamConfig.requireInvitation,
        defaultRole: 'viewer',
        ...settings,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    teams.value.push(team);
    return team;
  };

  const updateTeam = (teamId: string, updates: Partial<Team>): Team | null => {
    const team = teams.value.find(t => t.id === teamId);
    if (!team) return null;

    Object.assign(team, updates, { updatedAt: new Date() });
    return team;
  };

  const deleteTeam = (teamId: string): boolean => {
    const index = teams.value.findIndex(t => t.id === teamId);
    if (index === -1) return false;

    teams.value.splice(index, 1);
    return true;
  };

  const getTeam = (teamId: string): Team | undefined => {
    return teams.value.find(t => t.id === teamId);
  };

  const setCurrentTeam = (teamId: string): boolean => {
    const team = getTeam(teamId);
    if (!team) return false;

    currentTeam.value = team;
    members.value = team.members;
    invitations.value = team.invitations;
    return true;
  };

  const addMember = (
    teamId: string,
    email: string,
    role: TeamRole,
    name?: string,
  ): TeamMember | null => {
    const team = getTeam(teamId);
    if (!team) return null;
    if (team.members.length >= teamConfig.maxMembers) return null;

    const member: TeamMember = {
      id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      email,
      name,
      role,
      status: 'active',
      joinedAt: new Date(),
    };

    team.members.push(member);
    members.value = team.members;

    return member;
  };

  const removeMember = (teamId: string, memberId: string): boolean => {
    const team = getTeam(teamId);
    if (!team) return false;

    const index = team.members.findIndex(m => m.id === memberId);
    if (index === -1) return false;

    team.members.splice(index, 1);
    members.value = team.members;
    return true;
  };

  const updateMemberRole = (teamId: string, memberId: string, role: TeamRole): boolean => {
    const team = getTeam(teamId);
    if (!team) return false;

    const member = team.members.find(m => m.id === memberId);
    if (!member) return false;

    member.role = role;
    members.value = team.members;
    return true;
  };

  const inviteMember = (
    teamId: string,
    email: string,
    role: TeamRole,
  ): TeamInvitation | null => {
    const team = getTeam(teamId);
    if (!team) return null;

    const invitation: TeamInvitation = {
      id: crypto.randomUUID(),
      teamId,
      email,
      role,
      status: 'pending',
      invitedBy: 'current-user',
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    team.invitations.push(invitation);
    invitations.value = team.invitations;

    return invitation;
  };

  const cancelInvitation = (teamId: string, invitationId: string): boolean => {
    const team = getTeam(teamId);
    if (!team) return false;

    const index = team.invitations.findIndex(i => i.id === invitationId);
    if (index === -1) return false;

    team.invitations.splice(index, 1);
    invitations.value = team.invitations;
    return true;
  };

  const acceptInvitation = (invitationId: string): TeamMember | null => {
    const team = teams.value.find(t => t.invitations.some(i => i.id === invitationId));
    if (!team) return null;

    const invitation = team.invitations.find(i => i.id === invitationId);
    if (!invitation || invitation.status !== 'pending') return null;

    invitation.status = 'accepted';
    invitations.value = team.invitations;

    return addMember(team.id, invitation.email, invitation.role);
  };

  const getMembersByRole = (role: TeamRole): TeamMember[] => {
    return members.value.filter(m => m.role === role);
  };

  const getPendingInvitations = (): TeamInvitation[] => {
    return invitations.value.filter(i => i.status === 'pending');
  };

  const logActivity = (
    teamId: string,
    type: TeamActivity['type'],
    description: string,
    metadata?: Record<string, unknown>,
  ): TeamActivity => {
    const activity: TeamActivity = {
      id: crypto.randomUUID(),
      teamId,
      type,
      description,
      userId: 'current-user',
      timestamp: new Date(),
      metadata,
    };

    activities.value.unshift(activity);
    return activity;
  };

  const getRecentActivity = (limit: number = 20): TeamActivity[] => {
    return activities.value.slice(0, limit);
  };

  return {
    teams,
    currentTeam,
    members,
    invitations,
    activities,
    isLoading,
    isEnabled,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    setCurrentTeam,
    addMember,
    removeMember,
    updateMemberRole,
    inviteMember,
    cancelInvitation,
    acceptInvitation,
    getMembersByRole,
    getPendingInvitations,
    logActivity,
    getRecentActivity,
  };
};
