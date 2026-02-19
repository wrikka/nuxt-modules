export interface Team {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  members: TeamMember[];
  invitations: TeamInvitation[];
  sites: TeamSite[];
  settings: TeamSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name?: string;
  role: TeamRole;
  status: TeamMemberStatus;
  joinedAt: Date;
}

export type TeamMemberStatus = 'active' | 'inactive' | 'pending';

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';

export interface TeamSite {
  siteId: string;
  name: string;
  domain: string;
  permissions: SitePermission[];
}

export interface SitePermission {
  role: TeamRole;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  status: TeamInvitationStatus;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
}

export type TeamInvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  type: TeamActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export type TeamActivityType =
  | 'member_joined'
  | 'member_left'
  | 'member_role_changed'
  | 'site_added'
  | 'site_removed'
  | 'settings_changed'
  | 'invitation_sent'
  | 'invitation_accepted';

export interface TeamSettings {
  allowGuests: boolean;
  requireInvitation: boolean;
  defaultRole: TeamRole;
}

export interface TeamConfig {
  enabled: boolean;
  maxMembers: number;
  maxSites: number;
  allowGuests: boolean;
  requireInvitation: boolean;
}
