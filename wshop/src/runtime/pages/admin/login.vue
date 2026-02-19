<template>
  <LoginForm :is-logging-in="isLoggingIn" :error-message="errorMessage" @login="handleLogin" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '~/components/admin/login/LoginForm.vue';
import { useAuth } from '~/composables/core/useAuth';

definePageMeta({ layout: 'login' });

const { login } = useAuth();
const router = useRouter();

const isLoggingIn = ref(false);
const errorMessage = ref('');

interface LoginCredentials {
  email: string;
  password: string;
}

const handleLogin = async (credentials: LoginCredentials) => {
  isLoggingIn.value = true;
  errorMessage.value = '';
  const { success, message } = await login(credentials);
  if (success) {
    await router.push('/admin');
  } else {
    errorMessage.value = message || 'An unexpected error occurred.';
  }
  isLoggingIn.value = false;
};
</script>
