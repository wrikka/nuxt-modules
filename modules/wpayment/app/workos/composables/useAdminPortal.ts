import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  status: 'active' | 'inactive' | 'pending'
  role: string
  lastActive: Date
  avatar?: string
}

export interface Organization {
  id: string
  name: string
  memberCount: number
  activeUsers: number
  ssoConnections: number
}

export interface Role {
  id: string
  name: string
  description: string
  userCount: number
  permissions: string[]
  isSystem: boolean
}

const TABS = [
  { id: 'users', label: 'Users', icon: 'UsersIcon' },
  { id: 'organizations', label: 'Organizations', icon: 'BuildingIcon' },
  { id: 'roles', label: 'Roles', icon: 'ShieldIcon' },
  { id: 'settings', label: 'Settings', icon: 'SettingsIcon' },
  { id: 'security', label: 'Security', icon: 'LockIcon' },
] as const

export function useAdminPortal() {
  const activeTab = ref('users')
  const tabs = TABS

  // User management
  const users = ref<User[]>([
    { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', status: 'active', role: 'Admin', lastActive: new Date() },
    { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', status: 'active', role: 'Editor', lastActive: new Date(Date.now() - 86400000) },
    { id: '3', email: 'bob@example.com', firstName: 'Bob', lastName: 'Johnson', status: 'pending', role: 'Viewer', lastActive: new Date(Date.now() - 172800000) },
  ])
  const userSearch = ref('')
  const userFilter = ref('all')
  const loadingUsers = ref(false)

  const filteredUsers = computed(() => {
    let result = users.value
    if (userSearch.value) {
      const search = userSearch.value.toLowerCase()
      result = result.filter(u =>
        u.email.toLowerCase().includes(search) ||
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search)
      )
    }
    if (userFilter.value !== 'all') {
      result = result.filter(u => u.status === userFilter.value)
    }
    return result
  })

  // Organizations
  const organizations = ref<Organization[]>([
    { id: '1', name: 'Acme Corp', memberCount: 25, activeUsers: 20, ssoConnections: 2 },
    { id: '2', name: 'TechStart Inc', memberCount: 12, activeUsers: 10, ssoConnections: 1 },
    { id: '3', name: 'Global Solutions', memberCount: 50, activeUsers: 45, ssoConnections: 3 },
  ])
  const currentOrg = computed(() => organizations.value[0])

  // Roles
  const roles = ref<Role[]>([
    { id: '1', name: 'Admin', description: 'Full access to all features', userCount: 3, permissions: ['read', 'write', 'delete', 'admin'], isSystem: true },
    { id: '2', name: 'Editor', description: 'Can create and edit content', userCount: 8, permissions: ['read', 'write'], isSystem: true },
    { id: '3', name: 'Viewer', description: 'Read-only access', userCount: 15, permissions: ['read'], isSystem: true },
  ])

  // Current user
  const currentUser = ref({
    id: 'current',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'Super Admin',
    avatar: undefined,
  })

  return {
    activeTab,
    tabs,
    users,
    userSearch,
    userFilter,
    loadingUsers,
    filteredUsers,
    organizations,
    currentOrg,
    roles,
    currentUser,
  }
}

export function useAdminModals() {
  const showInviteModal = ref(false)
  const showCreateOrgModal = ref(false)
  const showEditUserModal = ref(false)
  const showPermissionsModal = ref(false)
  const selectedUser = ref<User | null>(null)

  const openInviteModal = () => { showInviteModal.value = true }
  const closeInviteModal = () => { showInviteModal.value = false }

  const openCreateOrgModal = () => { showCreateOrgModal.value = true }
  const closeCreateOrgModal = () => { showCreateOrgModal.value = false }

  const openEditUserModal = (user: User) => {
    selectedUser.value = user
    showEditUserModal.value = true
  }
  const closeEditUserModal = () => {
    selectedUser.value = null
    showEditUserModal.value = false
  }

  const openPermissionsModal = (user: User) => {
    selectedUser.value = user
    showPermissionsModal.value = true
  }
  const closePermissionsModal = () => {
    selectedUser.value = null
    showPermissionsModal.value = false
  }

  return {
    showInviteModal,
    showCreateOrgModal,
    showEditUserModal,
    showPermissionsModal,
    selectedUser,
    openInviteModal,
    closeInviteModal,
    openCreateOrgModal,
    closeCreateOrgModal,
    openEditUserModal,
    closeEditUserModal,
    openPermissionsModal,
    closePermissionsModal,
  }
}

export function useAdminActions() {
  const switchOrg = (orgId: string) => {
    console.log('Switching to org:', orgId)
  }

  const logout = () => {
    console.log('Logging out...')
  }

  const selectUser = (user: User) => {
    console.log('Selected user:', user)
  }

  const editUser = (user: User) => {
    console.log('Editing user:', user)
  }

  const showPermissions = (user: User) => {
    console.log('Show permissions for:', user)
  }

  const removeUser = (user: User) => {
    console.log('Removing user:', user)
  }

  const selectOrg = (org: Organization) => {
    console.log('Selected org:', org)
  }

  const editRole = (role: Role) => {
    console.log('Editing role:', role)
  }

  const deleteRole = (role: Role) => {
    console.log('Deleting role:', role)
  }

  const createRole = () => {
    console.log('Creating new role...')
  }

  return {
    switchOrg,
    logout,
    selectUser,
    editUser,
    showPermissions,
    removeUser,
    selectOrg,
    editRole,
    deleteRole,
    createRole,
  }
}
