<template>
  <div class="sso-section">
    <div class="divider">
      <span>{{ dividerText }}</span>
    </div>
    <div class="sso-buttons">
      <button
        v-for="provider in providers"
        :key="provider.id"
        type="button"
        class="sso-btn"
        @click="$emit('sso-login', provider.id)"
      >
        <img v-if="provider.icon" :src="provider.icon" :alt="provider.name" />
        <span>{{ provider.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SSOProvider } from "../../../types/login"

interface Props {
  providers: SSOProvider[]
  dividerText?: string
}

withDefaults(defineProps<Props>(), {
  dividerText: "Or continue with",
})

defineEmits<{
  "sso-login": [providerId: string]
}>()
</script>

<style scoped>
.sso-section {
  margin-top: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  font-size: 0.75rem;
  color: #9ca3af;
}

.sso-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sso-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.sso-btn:hover {
  background: #f9fafb;
}

.sso-btn img {
  width: 1rem;
  height: 1rem;
}
</style>
