export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: PermissionResource;
  actions: PermissionAction[];
}

export type PermissionResource = 'flag' | 'experiment' | 'environment' | 'audit' | 'settings';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'enable' | 'disable' | 'export';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: number;
  assignedBy: string;
}

export interface PermissionCheck {
  userId: string;
  resource: PermissionResource;
  action: PermissionAction;
  flagKey?: string;
  environment?: string;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  requiredPermissions: string[];
}

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features',
    isDefault: false,
    permissions: [
      {
        id: 'all',
        name: 'All Permissions',
        description: 'Full access',
        resource: 'flag',
        actions: ['create', 'read', 'update', 'delete', 'enable', 'disable', 'export'],
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Can create and manage flags',
    isDefault: true,
    permissions: [
      { id: 'flag-read', name: 'Read Flags', description: 'View flags', resource: 'flag', actions: ['read'] },
      {
        id: 'flag-create',
        name: 'Create Flags',
        description: 'Create new flags',
        resource: 'flag',
        actions: ['create'],
      },
      {
        id: 'flag-update',
        name: 'Update Flags',
        description: 'Update flag settings',
        resource: 'flag',
        actions: ['update'],
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    isDefault: false,
    permissions: [
      { id: 'flag-read-only', name: 'Read Only', description: 'View flags only', resource: 'flag', actions: ['read'] },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
