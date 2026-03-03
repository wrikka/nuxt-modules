// useOrgHierarchy Composable
// Core logic for the Organization Hierarchy

import { ref, computed } from 'vue'
import type { Organization, OrgForm, ViewMode, OrgStatus } from '../types/organization'

const flattenOrganizations = (orgs: Organization[], result: Organization[] = []): Organization[] => {
  for (const org of orgs) {
    result.push(org)
    if (org.children.length > 0) {
      flattenOrganizations(org.children, result)
    }
  }
  return result
}

export function useOrgHierarchy() {
  const searchQuery = ref("")
  const viewMode = ref<ViewMode>("tree")
  const expandedNodes = ref<string[]>(["1", "2"])
  const showAddModal = ref(false)
  const editingOrg = ref<Organization | null>(null)
  const parentForNewOrg = ref<Organization | null>(null)

  const orgForm = ref<OrgForm>({
    name: "",
    parentId: "",
    status: "active",
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

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date): string => {
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
    // Delete logic - to be implemented
    console.log("Delete org:", id)
  }

  const viewDetails = (org: Organization) => {
    // View details logic - to be implemented
    console.log("View details:", org.name)
  }

  const closeAddModal = () => {
    showAddModal.value = false
    editingOrg.value = null
    parentForNewOrg.value = null
    orgForm.value = { name: "", parentId: "", status: "active" }
  }

  const saveOrg = () => {
    // Save logic - to be implemented
    console.log("Save org:", orgForm.value)
    closeAddModal()
  }

  return {
    searchQuery,
    viewMode,
    expandedNodes,
    showAddModal,
    editingOrg,
    parentForNewOrg,
    orgForm,
    organizations,
    flatOrganizations,
    filteredOrganizations,
    totalOrganizations,
    totalMembers,
    maxDepth,
    getInitials,
    formatDate,
    toggleNode,
    expandAll,
    collapseAll,
    editOrg,
    addSubOrg,
    deleteOrg,
    viewDetails,
    closeAddModal,
    saveOrg,
  }
}
