// Organization Hierarchy Types
// Type definitions for the WorkOS Organization Hierarchy

export type OrgStatus = "active" | "inactive" | "pending"
export type ViewMode = "tree" | "cards"

export interface Organization {
  id: string
  name: string
  logo?: string
  status: OrgStatus
  memberCount: number
  children: Organization[]
  level: number
  parentId?: string
  createdAt: Date
}

export interface OrgForm {
  name: string
  parentId: string
  status: OrgStatus
}

export interface OrgSummary {
  totalOrganizations: number
  totalMembers: number
  maxDepth: number
}

export interface OrgHierarchyState {
  searchQuery: string
  viewMode: ViewMode
  expandedNodes: string[]
  showAddModal: boolean
  editingOrg: Organization | null
  parentForNewOrg: Organization | null
  orgForm: OrgForm
}
