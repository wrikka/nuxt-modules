<script setup lang="ts">
import type { Email } from '../../shared/types/email';

const props = defineProps<{
  email: Email;
}>();

const emit = defineEmits(['close']);

const router = useRouter();

async function _snoozeEmail(snoozedUntil: string) {
  await $fetch(`/api/emails/${props.email.id}`, {
    method: 'PATCH',
    body: {
      folder: 'snoozed',
      snoozedUntil,
    },
  });
  emit('close');
  await router.push('/');
}

function getTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  return tomorrow.toISOString();
}

function getNextWeekend() {
  const today = new Date();
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
  nextSaturday.setHours(8, 0, 0, 0);
  return nextSaturday.toISOString();
}

const _snoozeOptions = [
  { label: 'Later today', time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() },
  { label: 'Tomorrow', time: getTomorrow() },
  { label: 'Next weekend', time: getNextWeekend() },
];
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="emit('close')">
    <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
      <h3 class="text-lg font-medium mb-4">Snooze until...</h3>
      <ul>
        <li v-for="option in _snoozeOptions" :key="option.label">
          <button @click="_snoozeEmail(option.time)" class="w-full text-left px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700">
            {{ option.label }} <span class="text-sm text-slate-500">{{ new Date(option.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          </button>
        </li>
      </ul>
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Pick a date & time</label>
        <input type="datetime-local" class="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600" @change="(e) => _snoozeEmail((e.target as HTMLInputElement).value)" />
      </div>
    </div>
  </div>
</template>
