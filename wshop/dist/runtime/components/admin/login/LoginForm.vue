<template>
  <div class="w-full max-w-md">
    <div class="bg-white shadow-md rounded-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-6">Admin Login</h1>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" id="email" v-model="credentials.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password" id="password" v-model="credentials.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div v-if="errorMessage" class="mb-4 text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>
        <div class="flex items-center justify-between">
          <button type="submit" :disabled="isLoggingIn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-blue-300">
            {{ isLoggingIn ? "Logging in..." : "Sign In" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isLoggingIn: { type: Boolean, required: true },
  errorMessage: { type: String, required: true }
});
const emit = defineEmits(["login"]);
const credentials = ref({
  email: "",
  password: ""
});
const submitForm = () => {
  emit("login", credentials.value);
};
</script>
