<template>
  <div class="fullscreen-container">
    <div class="fullscreen-content">
      <div class="brand-section">
        <img v-if="logo" :src="logo" :alt="title" class="brand-logo" />
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>

      <div class="form-section">
        <form class="login-form" @submit.prevent="handleSubmit">
          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-group">
            <label for="email">Email address</label>
            <input id="email" v-model="form.email" type="email" placeholder="Enter your email" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Signing in..." : "Sign in to your account" }}
          </button>
        </form>

        <WorkOSLoginSSO
          v-if="ssoProviders?.length"
          :providers="ssoProviders"
          divider-text="Or sign in with"
          @sso-login="$emit('sso-login', $event)"
        />

        <div v-if="showSignup" class="signup-link">
          New to {{ title }}? <a href="#" @click.prevent="$emit('signup')">Create an account</a>
        </div>
      </div>
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
  logo?: string
  error?: string
  loading?: boolean
  ssoProviders?: SSOProvider[]
  showSignup?: boolean
}

withDefaults(defineProps<Props>(), {
  title: "Welcome",
  subtitle: "",
  logo: "",
  error: "",
  loading: false,
  ssoProviders: () => [],
  showSignup: true,
})

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string; remember: boolean }]
  "sso-login": [providerId: string]
  signup: []
}>()

const { form, handleSubmit } = useLoginForm(emit)
</script>

<style scoped>
.fullscreen-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.fullscreen-content {
  width: 100%;
  max-width: 480px;
}

.brand-section {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.brand-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.brand-section h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.brand-section p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.form-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
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
