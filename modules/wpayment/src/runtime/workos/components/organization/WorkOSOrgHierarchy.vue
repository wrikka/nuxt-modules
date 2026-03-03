<template>
  <div class="org-hierarchy">
    <div class="hierarchy-header">
      <h2>Organization Hierarchy</h2>
      <div class="header-actions">
        <WorkOSButton variant="secondary" @click="expandAll">Expand All</WorkOSButton>
        <WorkOSButton variant="secondary" @click="collapseAll">Collapse All</WorkOSButton>
        <WorkOSButton variant="primary" @click="showAddModal = true">Add Organization</WorkOSButton>
      </div>
    </div>

    <div class="hierarchy-controls">
      <input v-model="searchQuery" type="text" placeholder="Search organizations..." />
      <div class="view-options">
        <button
          :class="['view-btn', { active: viewMode === 'tree' }]"
          @click="viewMode = 'tree'"
        >
          🌳 Tree
        </button>
        <button
          :class="['view-btn', { active: viewMode === 'cards' }]"
          @click="viewMode = 'cards'"
        >
          📋 Cards
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'tree'" class="tree-view">
      <div class="tree-container">
        <div
          v-for="org in filteredOrganizations"
          :key="org.id"
          class="org-node"
          :style="{ marginLeft: `${org.level * 24}px` }"
        >
          <div class="node-content" @click="toggleNode(org.id)">
            <span :class="['expand-icon', { expanded: expandedNodes.includes(org.id) }]">
              {{ org.children.length > 0 ? (expandedNodes.includes(org.id) ? '▼' : '▶') : '•' }}
            </span>
            <div class="org-avatar">
              <img v-if="org.logo" :src="org.logo" :alt="org.name" />
              <div v-else class="avatar-placeholder">{{ getInitials(org.name) }}</div>
            </div>
            <div class="org-info">
              <h4>{{ org.name }}</h4>
              <p>{{ org.memberCount }} members • {{ org.children.length }} sub-orgs</p>
            </div>
            <div class="org-status">
              <span :class="['status-badge', org.status]">{{ org.status }}</span>
            </div>
            <div class="org-actions">
              <button class="action-btn" title="Edit" @click.stop="editOrg(org)">✏️</button>
              <button class="action-btn" title="Add Sub-org" @click.stop="addSubOrg(org)">➕</button>
              <button class="action-btn" title="Delete" @click.stop="deleteOrg(org.id)">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="cards-view">
      <div
        v-for="org in filteredOrganizations"
        :key="org.id"
        class="org-card"
      >
        <div class="card-header">
          <div class="org-avatar large">
            <img v-if="org.logo" :src="org.logo" :alt="org.name" />
            <div v-else class="avatar-placeholder">{{ getInitials(org.name) }}</div>
          </div>
          <div class="card-title">
            <h4>{{ org.name }}</h4>
            <span :class="['status-badge', org.status]">{{ org.status }}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="stat-row">
            <span class="stat-label">Members</span>
            <span class="stat-value">{{ org.memberCount }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Sub-organizations</span>
            <span class="stat-value">{{ org.children.length }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Created</span>
            <span class="stat-value">{{ formatDate(org.createdAt) }}</span>
          </div>
        </div>
        <div class="card-footer">
          <WorkOSButton variant="secondary" sm @click="viewDetails(org)">View Details</WorkOSButton>
          <WorkOSButton variant="primary" sm @click="editOrg(org)">Edit</WorkOSButton>
        </div>
      </div>
    </div>

    <div class="hierarchy-summary">
      <div class="summary-stat">
        <span class="summary-value">{{ totalOrganizations }}</span>
        <span class="summary-label">Total Organizations</span>
      </div>
      <div class="summary-stat">
        <span class="summary-value">{{ totalMembers }}</span>
        <span class="summary-label">Total Members</span>
      </div>
      <div class="summary-stat">
        <span class="summary-value">{{ maxDepth }}</span>
        <span class="summary-label">Max Depth</span>
      </div>
    </div>

    <WorkOSModal
      :show="showAddModal"
      :title="editingOrg ? 'Edit Organization' : 'Add Organization'"
      @close="closeAddModal"
    >
      <div class="add-org-form">
        <div class="form-group">
          <label>Organization Name *</label>
          <input v-model="orgForm.name" type="text" placeholder="Enter organization name" />
        </div>
        <div class="form-group">
          <label>Parent Organization</label>
          <select v-model="orgForm.parentId">
            <option value="">None (Root)</option>
            <option v-for="org in flatOrganizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="orgForm.status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <template #footer>
        <WorkOSButton variant="secondary" @click="closeAddModal">Cancel</WorkOSButton>
        <WorkOSButton variant="primary" @click="saveOrg">Save</WorkOSButton>
      </template>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

interface Organization {
  id: string
  name: string
  logo?: string
  status: "active" | "inactive" | "pending"
  memberCount: number
  children: Organization[]
  level: number
  parentId?: string
  createdAt: Date
}

const searchQuery = ref("")
const viewMode = ref<"tree" | "cards">("tree")
const expandedNodes = ref<string[]>(["1", "2"])
const showAddModal = ref(false)
const editingOrg = ref<Organization | null>(null)
const parentForNewOrg = ref<Organization | null>(null)

const orgForm = ref({
  name: "",
  parentId: "",
  status: "active" as "active" | "inactive" | "pending",
})

const organizations = ref<Organization[]>([
  {
    id: "1",
    name: "Acme Corporation",
    status: "active",
    memberCount: 150,
    level: 0,
    createdAt: new Date("2023-01-15"),
    children: [
      {
        id: "1-1",
        name: "Acme Engineering",
        status: "active",
        memberCount: 45,
        level: 1,
        parentId: "1",
        createdAt: new Date("2023-02-01"),
        children: [
          {
            id: "1-1-1",
            name: "Frontend Team",
            status: "active",
            memberCount: 12,
            level: 2,
            parentId: "1-1",
            createdAt: new Date("2023-03-01"),
            children: [],
          },
          {
            id: "1-1-2",
            name: "Backend Team",
            status: "active",
            memberCount: 15,
            level: 2,
            parentId: "1-1",
            createdAt: new Date("2023-03-01"),
            children: [],
          },
        ],
      },
      {
        id: "1-2",
        name: "Acme Marketing",
        status: "active",
        memberCount: 30,
        level: 1,
        parentId: "1",
        createdAt: new Date("2023-02-01"),
        children: [],
      },
    ],
  },
  {
    id: "2",
    name: "Tech Industries",
    status: "active",
    memberCount: 200,
    level: 0,
    createdAt: new Date("2022-06-01"),
    children: [
      {
        id: "2-1",
        name: "Tech R&D",
        status: "active",
        memberCount: 60,
        level: 1,
        parentId: "2",
        createdAt: new Date("2022-07-01"),
        children: [],
      },
    ],
  },
])

const flattenOrganizations = (orgs: Organization[], result: Organization[] = []): Organization[] => {
  for (const org of orgs) {
    result.push(org)
    if (org.children.length > 0) {
      flattenOrganizations(org.children, result)
    }
  }
  return result
}

const flatOrganizations = computed(() => flattenOrganizations(organizations.value))

const filteredOrganizations = computed(() => {
  if (!searchQuery.value) return flatOrganizations.value
  const query = searchQuery.value.toLowerCase()
  return flatOrganizations.value.filter(org =>
    org.name.toLowerCase().includes(query)
  )
})

const totalOrganizations = computed(() => flatOrganizations.value.length)
const totalMembers = computed(() => 
  flatOrganizations.value.reduce((sum, org) => sum + org.memberCount, 0)
)
const maxDepth = computed(() => 
  Math.max(...flatOrganizations.value.map(org => org.level))
)

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const toggleNode = (id: string) => {
  const index = expandedNodes.value.indexOf(id)
  if (index > -1) {
    expandedNodes.value.splice(index, 1)
  } else {
    expandedNodes.value.push(id)
  }
}

const expandAll = () => {
  expandedNodes.value = flatOrganizations.value.map(org => org.id)
}

const collapseAll = () => {
  expandedNodes.value = []
}

const editOrg = (org: Organization) => {
  editingOrg.value = org
  orgForm.value = {
    name: org.name,
    parentId: org.parentId || "",
    status: org.status,
  }
  showAddModal.value = true
}

const addSubOrg = (org: Organization) => {
  parentForNewOrg.value = org
  orgForm.value = {
    name: "",
    parentId: org.id,
    status: "active",
  }
  showAddModal.value = true
}

const deleteOrg = (id: string) => {
  // Delete logic
}

const viewDetails = (org: Organization) => {
  // View details logic
}

const closeAddModal = () => {
  showAddModal.value = false
  editingOrg.value = null
  parentForNewOrg.value = null
  orgForm.value = { name: "", parentId: "", status: "active" }
}

const saveOrg = () => {
  // Save logic
  closeAddModal()
}
</script>

<style scoped>
.org-hierarchy {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hierarchy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.hierarchy-header h2 {
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.hierarchy-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.hierarchy-controls input {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  width: 300px;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.tree-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.org-node {
  border-bottom: 1px solid #f3f4f6;
}

.org-node:last-child {
  border-bottom: none;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.node-content:hover {
  background: #f9fafb;
}

.expand-icon {
  width: 16px;
  font-size: 0.625rem;
  color: #6b7280;
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.org-avatar {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
}

.org-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.75rem;
}

.org-avatar.large {
  width: 48px;
  height: 48px;
}

.org-info {
  flex: 1;
}

.org-info h4 {
  margin: 0;
  color: #1f2937;
  font-size: 0.875rem;
}

.org-info p {
  margin: 0.125rem 0 0 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.org-status {
  margin-right: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #059669;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.org-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.node-content:hover .org-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #e5e7eb;
}

.cards-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.org-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
}

.card-title {
  flex: 1;
}

.card-title h4 {
  margin: 0;
  color: #1f2937;
}

.card-body {
  padding: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.stat-value {
  color: #1f2937;
  font-weight: 500;
  font-size: 0.875rem;
}

.card-footer {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.hierarchy-summary {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.add-org-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}
</style>
