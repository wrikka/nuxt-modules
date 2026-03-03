// useLoginForm Composable
// Shared form logic for the Login Page variants

import { ref } from 'vue'
import type { LoginForm, LoginCredentials, LoginEmits } from '../types/login'

export function useLoginForm(emit: {
  (event: 'submit', credentials: LoginCredentials): void
  (event: 'sso-login', providerId: string): void
  (event: 'magic-link', email: string): void
  (event: 'forgot-password'): void
  (event: 'signup'): void
}) {
  const form = ref<LoginForm>({
    email: '',
    password: '',
    remember: false,
  })

  const showPassword = ref(false)

  const handleSubmit = () => {
    emit('submit', { ...form.value })
  }

  const handleSSOLogin = (providerId: string) => {
    emit('sso-login', providerId)
  }

  const handleMagicLink = () => {
    if (form.value.email) {
      emit('magic-link', form.value.email)
    }
  }

  const handleForgotPassword = () => {
    emit('forgot-password')
  }

  const handleSignup = () => {
    emit('signup')
  }

  const resetForm = () => {
    form.value = {
      email: '',
      password: '',
      remember: false,
    }
    showPassword.value = false
  }

  return {
    form,
    showPassword,
    handleSubmit,
    handleSSOLogin,
    handleMagicLink,
    handleForgotPassword,
    handleSignup,
    resetForm,
  }
}
