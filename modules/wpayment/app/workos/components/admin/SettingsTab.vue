<script setup lang="ts">
import type { Role } from "../../composables/useAdminPortal"

const props = defineProps<{
  roles: Role[]
}>()

const emit = defineEmits<{
  save: []
  reset: []
}>()

const settings = ref({
  sessionTimeout: 60,
  requireMfa: false,
  passwordPolicy: 'standard',
  autoProvision: true,
  defaultRole: '',
  emailNotifications: true,
  webhookUrl: '',
})

const save = () => emit('save', settings.value)
const reset = () => emit('reset')
</script>

<template>
  <section class="tab-section">
    <div class="settings-grid">
      <div class="settings-card">
        <h3>Authentication Settings</h3>
        <div class="setting-item">
          <label>Session Timeout (minutes)</label>
          <input v-model="settings.sessionTimeout" type="number" min="5" max="1440" />
        </div>
        <div class="setting-item">
          <label>Require MFA</label>
          <input v-model="settings.requireMfa" type="checkbox" />
        </div>
        <div class="setting-item">
          <label>Password Policy</label>
          <select v-model="settings.passwordPolicy">
            <option value="standard">Standard</option>
            <option value="strong">Strong</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      <div class="settings-card">
        <h3>SSO Settings</h3>
        <div class="setting-item">
          <label>Auto-provision users</label>
          <input v-model="settings.autoProvision" type="checkbox" />
        </div>
        <div class="setting-item">
          <label>Default role for new users</label>
          <select v-model="settings.defaultRole">
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
      </div>
      <div class="settings-card">
        <h3>Notifications</h3>
        <div class="setting-item">
          <label>Email notifications</label>
          <input v-model="settings.emailNotifications" type="checkbox" />
        </div>
        <div class="setting-item">
          <label>Webhook URL</label>
          <input v-model="settings.webhookUrl" type="url" placeholder="https://" />
        </div>
      </div>
    </div>
    <div class="settings-actions">
      <WorkOSButton variant="secondary" @click="reset">Reset to Defaults</WorkOSButton>
      <WorkOSButton variant="primary" @click="save">Save Settings</WorkOSButton>
    </div>
  </section>
</template>

<style scoped>
.tab-section {
  padding: 1.5rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
}

.settings-card h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #1f2937;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item label {
  font-size: 0.875rem;
  color: #374151;
}

.setting-item input[type="number"],
.setting-item input[type="text"],
.setting-item input[type="url"],
.setting-item select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.setting-item input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
