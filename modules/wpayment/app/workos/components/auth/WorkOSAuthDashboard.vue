<template>
  <div class="workos-dashboard">
    <div class="dashboard-header">
      <h1>WorkOS Authentication Dashboard</h1>
      <div class="header-actions">
        <WorkOSButton variant="primary" @click="refreshData">Refresh</WorkOSButton>
        <WorkOSButton variant="secondary" @click="showCreateUserModal = true">Add User</WorkOSButton>
      </div>
    </div>

    <div class="dashboard-stats">
      <WorkOSStatCard :value="stats.totalUsers" label="Total Users" />
      <WorkOSStatCard :value="stats.activeSessions" label="Active Sessions" />
      <WorkOSStatCard :value="stats.totalOrganizations" label="Organizations" />
      <WorkOSStatCard :value="stats.totalConnections" label="Connections" />
    </div>

    <div class="dashboard-content">
      <div class="content-section">
        <h2>Recent Users</h2>
        <WorkOSUserTable :users="recentUsers" @edit="editUser" @revoke="revokeSession" />
      </div>

      <div class="content-section">
        <h2>Organization Sessions</h2>
        <div class="session-grid">
          <WorkOSSessionCard
            v-for="session in organizationSessions"
            :key="session.id"
            :session="session"
            @switch="switchToSession(session.id)"
            @revoke="revokeSession(session.id)"
          />
        </div>
      </div>
    </div>

    <WorkOSCreateUserModal
      :show="showCreateUserModal"
      :organizations="organizations"
      :roles="roles"
      @close="showCreateUserModal = false"
      @submit="createUser"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import type { WorkOSDashboardStats, WorkOSDashboardUser, WorkOSOrganizationSession } from "../shared/types/dashboard"
import { useWorkOSOrganizations, useWorkOSRBAC, useWorkOSSessions } from "../composables"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSStatCard from "./base/WorkOSStatCard.vue"
import WorkOSUserTable from "./dashboard/WorkOSUserTable.vue"
import WorkOSSessionCard from "./dashboard/WorkOSSessionCard.vue"
import WorkOSCreateUserModal from "./dashboard/WorkOSCreateUserModal.vue"

interface Role {
	id: string
	name: string
	description?: string
	permissions: string[]
}

interface Organization {
	id: string
	name: string
}

interface NewUserData {
	email: string
	firstName: string
	lastName: string
	organizationId: string
	roleId?: string
}

const stats = ref<WorkOSDashboardStats>({
	totalUsers: 0,
	activeSessions: 0,
	totalOrganizations: 0,
	totalConnections: 0,
})

const recentUsers = ref<WorkOSDashboardUser[]>([])
const organizationSessions = ref<WorkOSOrganizationSession[]>([])
const organizations = ref<Organization[]>([])
const roles = ref<Role[]>([])
const showCreateUserModal = ref(false)

const { revokeSession: revokeSessionApi, switchOrganization } = useWorkOSSessions()
const { listOrganizations } = useWorkOSOrganizations()
const { getRoles } = useWorkOSRBAC()

const refreshData = async () => {
	try {
		const [statsData, usersData, sessionsData, orgsData] = await Promise.all([
			$fetch("/api/workos/dashboard/stats"),
			$fetch("/api/workos/dashboard/users"),
			$fetch("/api/workos/dashboard/sessions"),
			listOrganizations(),
		])

		stats.value = statsData as WorkOSDashboardStats
		recentUsers.value = usersData as WorkOSDashboardUser[]
		organizationSessions.value = sessionsData as WorkOSOrganizationSession[]
		organizations.value = orgsData.data || []

		if (organizations.value[0]) {
			roles.value = await getRoles(organizations.value[0].id)
		}
	} catch (error) {
		console.error("Failed to refresh data:", error)
	}
}

const createUser = async (data: NewUserData) => {
	try {
		await $fetch("/api/workos/users", {
			method: "POST",
			body: data,
		})
		showCreateUserModal.value = false
		await refreshData()
	} catch (error) {
		console.error("Failed to create user:", error)
	}
}

const editUser = (user: WorkOSDashboardUser) => {
	console.log("Edit user:", user)
}

const revokeSession = async (sessionId: string) => {
	try {
		await revokeSessionApi(sessionId)
		await refreshData()
	} catch (error) {
		console.error("Failed to revoke session:", error)
	}
}

const switchToSession = async (sessionId: string) => {
	try {
		await switchOrganization({ organizationId: sessionId })
		await refreshData()
	} catch (error) {
		console.error("Failed to switch session:", error)
	}
}

onMounted(() => {
	refreshData()
})
</script>

<style scoped>
.workos-dashboard {
	padding: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.dashboard-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.dashboard-header h1 {
	margin: 0;
	color: #1f2937;
}

.header-actions {
	display: flex;
	gap: 1rem;
}

.dashboard-stats {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;
}

.dashboard-content {
	display: grid;
	gap: 2rem;
}

.content-section h2 {
	margin-bottom: 1rem;
	color: #1f2937;
}

.session-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1rem;
}
</style>
