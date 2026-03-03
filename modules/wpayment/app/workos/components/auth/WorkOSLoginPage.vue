<template>
  <div class="login-page" :class="variant">
    <WorkOSLoginMinimal
      v-if="variant === 'minimal'"
      :title="title"
      :subtitle="subtitle"
      :error="error"
      :loading="loading"
      :sso-providers="ssoProviders"
      :show-magic-link="showMagicLink"
      :show-signup="showSignup"
      @submit="$emit('submit', $event)"
      @sso-login="$emit('sso-login', $event)"
      @magic-link="$emit('magic-link', $event)"
      @forgot-password="$emit('forgot-password')"
      @signup="$emit('signup')"
    />

    <WorkOSLoginCard
      v-else-if="variant === 'card'"
      :title="title"
      :subtitle="subtitle"
      :logo="logo"
      :error="error"
      :loading="loading"
      :sso-providers="ssoProviders"
      :show-signup="showSignup"
      @submit="$emit('submit', $event)"
      @sso-login="$emit('sso-login', $event)"
      @forgot-password="$emit('forgot-password')"
      @signup="$emit('signup')"
    />

    <WorkOSLoginSplit
      v-else-if="variant === 'split'"
      :title="title"
      :subtitle="subtitle"
      :logo="logo"
      :error="error"
      :loading="loading"
      :sso-providers="ssoProviders"
      :features="features"
      @submit="$emit('submit', $event)"
      @sso-login="$emit('sso-login', $event)"
    />

    <WorkOSLoginFullscreen
      v-else-if="variant === 'fullscreen'"
      :title="title"
      :subtitle="subtitle"
      :logo="logo"
      :error="error"
      :loading="loading"
      :sso-providers="ssoProviders"
      :show-signup="showSignup"
      @submit="$emit('submit', $event)"
      @sso-login="$emit('sso-login', $event)"
      @signup="$emit('signup')"
    />
  </div>
</template>

<script setup lang="ts">
import type { LoginVariant, SSOProvider, Feature } from "../../../types/login"
import WorkOSLoginMinimal from "./WorkOSLoginMinimal.vue"
import WorkOSLoginCard from "./WorkOSLoginCard.vue"
import WorkOSLoginSplit from "./WorkOSLoginSplit.vue"
import WorkOSLoginFullscreen from "./WorkOSLoginFullscreen.vue"

interface Props {
  variant?: LoginVariant
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

withDefaults(defineProps<Props>(), {
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

defineEmits<{
  submit: [credentials: { email: string; password: string; remember: boolean }]
  "sso-login": [providerId: string]
  "magic-link": [email: string]
  "forgot-password": []
  signup: []
}>()
</script>

<style scoped>
.login-page {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
