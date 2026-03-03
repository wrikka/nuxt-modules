<template>
  <div class="split-container">
    <div class="split-left">
      <div class="brand-content">
        <img v-if="logo" :src="logo" :alt="title" class="brand-logo" />
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
        <div v-if="features?.length" class="features-list">
          <div v-for="feature in features" :key="feature.title" class="feature-item">
            <div class="feature-icon">{{ feature.icon }}</div>
            <div class="feature-content">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="split-right">
      <div class="login-card">
        <form class="login-form" @submit.prevent="handleSubmit">
          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" required />
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? "Signing in..." : "Sign in" }}
          </button>
        </form>

        <WorkOSLoginSSO
          v-if="ssoProviders?.length"
          :providers="ssoProviders"
          divider-text="or"
          @sso-login="$emit('sso-login', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SSOProvider, Feature } from "../../../types/login"
import { useLoginForm } from "../../../composables/useLoginForm"
import WorkOSLoginSSO from "./WorkOSLoginSSO.vue"

interface Props {
  title?: string
  subtitle?: string
  logo?: string
  error?: string
  loading?: boolean
  ssoProviders?: SSOProvider[]
  features?: Feature[]
}

withDefaults(defineProps<Props>(), {
  title: "Welcome back",
  subtitle: "",
  logo: "",
  error: "",
  loading: false,
  ssoProviders: () => [],
  features: () => [],
})

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string; remember: boolean }]
  "sso-login": [providerId: string]
}>()

const { form, handleSubmit } = useLoginForm(emit)
</script>

<style scoped>
.split-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.split-left {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
}

.brand-content {
  max-width: 400px;
  color: white;
}

.brand-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
}

.brand-content h1 {
  font-size: 2rem;
  margin: 0 0 1rem;
}

.brand-content p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0 0 2rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
}

.feature-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0.2);
  border-radius: 0.5rem;
  font-size: 1.25rem;
}

.feature-content h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.feature-content p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.split-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #f9fafb;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .split-container {
    grid-template-columns: 1fr;
  }

  .split-left {
    display: none;
  }
}
</style>
