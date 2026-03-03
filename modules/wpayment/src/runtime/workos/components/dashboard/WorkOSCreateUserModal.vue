<template>
  <WorkOSModal :show="show" title="Create New User" @close="$emit('close')">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label>First Name</label>
        <input v-model="form.firstName" type="text" required />
      </div>
      <div class="form-group">
        <label>Last Name</label>
        <input v-model="form.lastName" type="text" required />
      </div>
      <div class="form-group">
        <label>Organization</label>
        <select v-model="form.organizationId" required>
          <option value="">Select Organization</option>
          <option v-for="org in organizations" :key="org.id" :value="org.id">
            {{ org.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Role</label>
        <select v-model="form.roleId" required>
          <option value="">Select Role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>
    </form>
    <template #footer>
      <WorkOSButton variant="secondary" @click="$emit('close')">Cancel</WorkOSButton>
      <WorkOSButton variant="primary" @click="handleSubmit">Create User</WorkOSButton>
    </template>
  </WorkOSModal>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import WorkOSModal from "../base/WorkOSModal.vue"
import WorkOSButton from "../base/WorkOSButton.vue"

interface NewUserData {
	email: string
	firstName: string
	lastName: string
	organizationId: string
	roleId?: string
}

interface Role {
	id: string
	name: string
	description?: string
	permissions: string[]
}

interface OrganizationOption {
	id: string
	name: string
}

const props = defineProps<{
	show: boolean
	organizations: OrganizationOption[]
	roles: Role[]
}>()

const emit = defineEmits<{
	close: []
	submit: [data: NewUserData]
}>()

const form = reactive<NewUserData>({
	email: "",
	firstName: "",
	lastName: "",
	organizationId: "",
	roleId: "",
})

const handleSubmit = () => {
	emit("submit", { ...form })
	form.email = ""
	form.firstName = ""
	form.lastName = ""
	form.organizationId = ""
	form.roleId = ""
}
</script>

<style scoped>
.form-group {
	margin-bottom: 1rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 500;
	color: #374151;
}

.form-group input,
.form-group select {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	font-size: 1rem;
}
</style>
