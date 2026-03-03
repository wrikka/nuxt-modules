<template>
  <div class="login-card">
    <div class="card-header">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <form class="login-form" @submit.prevent="handleSubmit">
      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="Enter your email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" placeholder="Enter your password" required />
      </div>

      <div class="form-options">
        <label class="checkbox-label">
          <input v-model="form.remember" type="checkbox" />
          Remember me
        </label>
        <a href="#" class="forgot-link" @click.prevent="$emit('forgot-password')">Forgot password?</a>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        {{ loading ? "Signing in..." : "Sign in" }}
      </button>
    </form>

    <WorkOSLoginSSO v-if="ssoProviders?.length" :providers="ssoProviders" @sso-login="$emit('sso-login', $event)" />

    <div v-if="showMagicLink" class="magic-link-section">
      <button type="button" class="magic-link-btn" @click="$emit('magic-link', form.email)">
        Send magic link instead
      </button>
    </div>

    <div v-if="showSignup" class="signup-link">
      Don't have an account? <a href="#" @click.prevent="$emit('signup')">Sign up</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SSOProvider } from "../../../types/login"
import { useLoginForm } from "../../../composables/useLoginForm"
import WorkOSLoginSSO from "./WorkOSLoginSSO.vue"

interface Props {
  title?: string
  subtitle?: string
  error?: string
  loading?: boolean
  ssoProviders?: SSOProvider[]
  showMagicLink?: boolean
  showSignup?: boolean
}

withDefaults(defineProps<Props>(), {
  title: "Welcome back",
  subtitle: "",
  error: "",
  loading: false,
  ssoProviders: () => [],
  showMagicLink: false,
  showSignup: true,
})

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string; remember: boolean }]
  "sso-login": [providerId: string]
  "magic-link": [email: string]
  "forgot-password": []
  signup: []
}>()

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

.magic-link-section {
  margin-top: 1rem;
  text-align: center;
}

.magic-link-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
}

.magic-link-btn:hover {
  text-decoration: underline;
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
