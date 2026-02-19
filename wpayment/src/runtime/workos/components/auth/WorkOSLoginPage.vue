<template>
  <div class="login-page" :class="variant">
    <!-- Minimal Variant -->
    <div v-if="variant === 'minimal'" class="minimal-container">
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

        <div v-if="ssoProviders?.length" class="sso-section">
          <div class="divider">
            <span>Or continue with</span>
          </div>
          <div class="sso-buttons">
            <button
              v-for="provider in ssoProviders"
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

        <div v-if="showMagicLink" class="magic-link-section">
          <button type="button" class="magic-link-btn" @click="$emit('magic-link', form.email)">
            Send magic link instead
          </button>
        </div>

        <div v-if="showSignup" class="signup-link">
          Don't have an account? <a href="#" @click.prevent="$emit('signup')">Sign up</a>
        </div>
      </div>
    </div>

    <!-- Card Variant -->
    <div v-else-if="variant === 'card'" class="card-container">
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

        <div v-if="ssoProviders?.length" class="sso-section">
          <div class="divider">
            <span>Or continue with</span>
          </div>
          <div class="sso-buttons">
            <button
              v-for="provider in ssoProviders"
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

        <div v-if="showSignup" class="signup-link">
          Don't have an account? <a href="#" @click.prevent="$emit('signup')">Create account</a>
        </div>
      </div>
    </div>

    <!-- Split Variant -->
    <div v-else-if="variant === 'split'" class="split-container">
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

          <div v-if="ssoProviders?.length" class="sso-section">
            <div class="divider"><span>or</span></div>
            <div class="sso-buttons">
              <button
                v-for="provider in ssoProviders"
                :key="provider.id"
                type="button"
                class="sso-btn"
                @click="$emit('sso-login', provider.id)"
              >
                {{ provider.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Variant -->
    <div v-else-if="variant === 'fullscreen'" class="fullscreen-container">
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

          <div v-if="ssoProviders?.length" class="sso-section">
            <div class="divider"><span>Or sign in with</span></div>
            <div class="sso-buttons">
              <button
                v-for="provider in ssoProviders"
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

          <div v-if="showSignup" class="signup-link">
            New to {{ title }}? <a href="#" @click.prevent="$emit('signup')">Create an account</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface SSOProvider {
  id: string
  name: string
  icon?: string
}

interface Feature {
  icon: string
  title: string
  description: string
}

interface Props {
  variant?: "minimal" | "card" | "split" | "fullscreen"
  title?: string
  subtitle?: string
  logo?: string
  error?: string
  loading?: boolean
  ssoProviders?: SSOProvider[]
  showMagicLink?: boolean
  showSignup?: boolean
  features?: Feature[]
}

const props = withDefaults(defineProps<Props>(), {
  variant: "card",
  title: "Welcome back",
  subtitle: "Sign in to your account",
  logo: "",
  error: "",
  loading: false,
  ssoProviders: () => [],
  showMagicLink: false,
  showSignup: true,
  features: () => [],
})

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string; remember: boolean }]
  "sso-login": [providerId: string]
  "magic-link": [email: string]
  "forgot-password": []
  signup: []
}>()

const form = ref({
  email: "",
  password: "",
  remember: false,
})

const showPassword = ref(false)

const handleSubmit = () => {
  emit("submit", { ...form.value })
}
</script>

<style scoped>
.login-page {
  font-family: system-ui, -apple-system, sans-serif;
}

/* Minimal Variant */
.minimal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

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

/* Split Variant */
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

/* Fullscreen Variant */
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

.brand-section .brand-logo {
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

@media (max-width: 768px) {
  .split-container {
    grid-template-columns: 1fr;
  }

  .split-left {
    display: none;
  }
}
</style>
