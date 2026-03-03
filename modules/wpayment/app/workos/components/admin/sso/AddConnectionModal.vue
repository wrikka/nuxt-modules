<script setup lang="ts">
import type { NewConnection } from "./types"

const props = defineProps<{
  show: boolean
  modelValue: NewConnection
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'update:modelValue': [value: NewConnection]
  save: []
}>()

const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const newConnection = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const close = () => {
  show.value = false
}
</script>

<template>
  <WorkOSModal
    :show="show"
    title="Add SSO Connection"
    large
    @close="close"
  >
    <div class="add-connection-form">
      <div class="form-group">
        <label>Connection Name</label>
        <input v-model="newConnection.name" type="text" placeholder="e.g., Corporate SSO" />
      </div>
      <div class="form-group">
        <label>Provider</label>
        <select v-model="newConnection.provider">
          <option value="Okta">Okta</option>
          <option value="Azure AD">Azure AD</option>
          <option value="Google Workspace">Google Workspace</option>
          <option value="OneLogin">OneLogin</option>
          <option value="PingFederate">PingFederate</option>
        </select>
      </div>
      <div class="form-group">
        <label>Domain</label>
        <input v-model="newConnection.domain" type="text" placeholder="company.com" />
      </div>
      <div class="form-group">
        <label>Client ID</label>
        <input v-model="newConnection.clientId" type="text" placeholder="Enter client ID" />
      </div>
      <div class="form-group">
        <label>Client Secret</label>
        <input v-model="newConnection.clientSecret" type="password" placeholder="Enter client secret" />
      </div>
    </div>
    <template #footer>
      <WorkOSButton variant="secondary" @click="close">Cancel</WorkOSButton>
      <WorkOSButton variant="primary" @click="emit('save')">Save Connection</WorkOSButton>
    </template>
  </WorkOSModal>
</template>

<style scoped>
.add-connection-form {
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
