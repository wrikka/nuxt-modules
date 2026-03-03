<template>
  <div class="login-card elevated">
    <div class="card-header with-logo">
      <img v-if="logo" :src="logo" :alt="title" class="logo" />
      <div v-else class="logo-placeholder">{{ title?.charAt(0) || "W" }}</div>
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <form class="login-form" @submit.prevent="handleSubmit">
      <div v-if="error" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ error }}
      </div>

      <div class="form-group">
        <label for="email">Email address</label>
        <input id="email" v-model="form.email" type="email" placeholder="name@company.com" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.38 9.38 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <div class="form-options">
        <label class="checkbox-label">
          <input v-model="form.remember" type="checkbox" />
          <span>Remember me for 30 days</span>
        </label>
        <a href="#" class="forgot-link" @click.prevent="$emit('forgot-password')">Forgot password?</a>
      </div>

      <button type="submit" class="submit-btn primary" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        {{ loading ? "Signing in..." : "Sign in" }}
      </button>
    </form>

    <WorkOSLoginSSO v-if="ssoProviders?.length" :providers="ssoProviders" @sso-login="$emit('sso-login', $event)" />

    <div v-if="showSignup" class="signup-link">
      Don't have an account? <a href="#" @click.prevent="$emit('signup')">Create account</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { SSOProvider } from "../../../types/login"
import { useLoginForm } from "../../../composables/useLoginForm"
import WorkOSLoginSSO from "./WorkOSLoginSSO.vue"

interface Props {
  title?: string
  subtitle?: string
  logo?: string
  error?: string
  loading?: boolean
  ssoProviders?: SSOProvider[]
  showSignup?: boolean
}

withDefaults(defineProps<Props>(), {
  title: "Welcome back",
  subtitle: "Sign in to your account",
  logo: "",
  error: "",
  loading: false,
  ssoProviders: () => [],
  showSignup: true,
})

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string; remember: boolean }]
  "sso-login": [providerId: string]
  "forgot-password": []
  signup: []
}>()

const showPassword = ref(false)
const { form, handleSubmit } = useLoginForm(emit)
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
}

.elevated {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #111827;
}

.card-header p {
  margin: 0;
  color: #6b7280;
}

.card-header.with-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.logo-placeholder {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.password-input {
  position: relative;
}

.password-input input {
  width: 100%;
  padding-right: 2.5rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.checkbox-label input {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
}

.forgot-link {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
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

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.signup-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.signup-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
