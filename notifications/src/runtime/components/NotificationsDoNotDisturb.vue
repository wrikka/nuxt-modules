<script setup lang="ts">
import { ref } from 'vue';
import { useDoNotDisturb } from '../composables/useDoNotDisturb';

const { dndSettings, isDNDActive, toggleDND, setDNDSettings } = useDoNotDisturb();

const scheduleStart = ref(dndSettings.value.schedule?.start || '22:00');
const scheduleEnd = ref(dndSettings.value.schedule?.end || '08:00');
const autoReply = ref(dndSettings.value.autoReply || '');
const allowUrgent = ref(dndSettings.value.allowUrgent ?? true);

const handleToggle = () => {
  toggleDND();
  if (dndSettings.value.enabled) {
    setDNDSettings({
      schedule: { start: scheduleStart.value, end: scheduleEnd.value },
      autoReply: autoReply.value,
      allowUrgent: allowUrgent.value,
    });
  }
};

const handleSave = () => {
  setDNDSettings({
    schedule: { start: scheduleStart.value, end: scheduleEnd.value },
    autoReply: autoReply.value,
    allowUrgent: allowUrgent.value,
  });
};
</script>

<template>
  <div class="space-y-6 p-6">
    <h2 class="text-2xl font-bold">Do Not Disturb Mode</h2>

    <!-- DND Toggle -->
    <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div>
        <div class="font-semibold">Do Not Disturb</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ isDNDActive ? 'Active' : 'Inactive' }}
        </div>
      </div>
      <button
        class="relative h-12 w-24 rounded-full transition-colors"
        :class="dndSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'"
        @click="handleToggle"
      >
        <div
          class="absolute top-1 h-10 w-10 rounded-full bg-white shadow transition-transform"
          :class="dndSettings.enabled ? 'translate-x-14' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- Schedule -->
    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 class="mb-4 font-semibold">Schedule</h3>
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-400">Start Time</label>
          <input
            v-model="scheduleStart"
            type="time"
            class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            @change="handleSave"
          />
        </div>
        <span class="mt-6 text-gray-400">to</span>
        <div class="flex-1">
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-400">End Time</label>
          <input
            v-model="scheduleEnd"
            type="time"
            class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            @change="handleSave"
          />
        </div>
      </div>
    </div>

    <!-- Auto Reply -->
    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 class="mb-4 font-semibold">Auto Reply Message</h3>
      <textarea
        v-model="autoReply"
        rows="3"
        placeholder="Enter auto-reply message..."
        class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
        @change="handleSave"
      />
    </div>

    <!-- Urgent Notifications -->
    <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div>
        <div class="font-semibold">Allow Urgent Notifications</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Receive urgent notifications even in DND mode
        </div>
      </div>
      <button
        class="relative h-12 w-24 rounded-full transition-colors"
        :class="allowUrgent ? 'bg-blue-500' : 'bg-gray-300'"
        @click="allowUrgent = !allowUrgent; handleSave()"
      >
        <div
          class="absolute top-1 h-10 w-10 rounded-full bg-white shadow transition-transform"
          :class="allowUrgent ? 'translate-x-14' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- Status -->
    <div
      class="rounded-lg p-4 text-center"
      :class="isDNDActive ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' : 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200'"
    >
      <div class="font-semibold">
        {{ isDNDActive ? '🔕 Do Not Disturb is Active' : '🔔 Notifications Enabled' }}
      </div>
      <div class="mt-1 text-sm">
        {{ isDNDActive ? 'You will not receive notifications' : 'You will receive notifications normally' }}
      </div>
    </div>
  </div>
</template>
