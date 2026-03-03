<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">{{ isNew ? 'Add Staff Member' : 'Edit Staff Member' }}</h1>

    <form @submit.prevent="saveStaffMember" class="space-y-6 max-w-lg">
      <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" id="firstName" v-model="staff.firstName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" id="lastName" v-model="staff.lastName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" id="email" v-model="staff.email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" v-model="staff.password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :placeholder="isNew ? '' : 'Leave blank to keep current password'" :required="isNew">
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                    <select id="role" v-model="staff.role" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option :value="undefined">No Role</option>
            <option v-for="role in roles" :key="role.id" :value="role">{{ role.name }}</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <NuxtLink to="/admin/staff" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Cancel</NuxtLink>
        <button type="submit" :disabled="isSaving" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
          {{ isSaving ? 'Saving...' : 'Save Staff Member' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const staffId = route.params.id as string;
const isNew = !staffId;

const { staffMember, roles, fetchStaffMember, fetchRoles } = useStaff();

// Use a local ref for the form data, initialized for a new staff member
const staff = ref<Partial<Employee & { password?: string }>>({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: undefined,
});

const isSaving = ref(false);

onMounted(() => {
  fetchRoles();
  if (!isNew) {
    fetchStaffMember(staffId);
  }
});

// When staffMember data arrives from the fetch, update the local form ref
watch(staffMember, (newVal) => {
  if (newVal) {
    staff.value = { ...newVal, password: '' };
  } else if (isNew) {
    staff.value = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: undefined,
    };
  }
}, { immediate: true });

const saveStaffMember = async () => {
  isSaving.value = true;
  try {
    const { password, ...rest } = staff.value;
    const payload: Partial<Employee> & { password?: string } = rest;
    if (password) {
      payload.password = password;
    }
    
    // Only include password in payload if it's not blank
    if (password) {
      payload.password = password;
    }

    if (isNew) {
      await $fetch('/api/staff', { method: 'POST', body: payload });
    } else {
      await $fetch(`/api/staff/${staffId}`, { method: 'PUT', body: payload });
    }
    router.push('/admin/staff');
  } catch (error) {
    console.error('Failed to save staff member:', error);
    // TODO: Show error notification
  } finally {
    isSaving.value = false;
  }
};

definePageMeta({
  layout: 'admin',
});
</script>
