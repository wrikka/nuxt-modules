<script setup lang="ts">
import type { Email } from '../../shared/types/email';

const _props = defineProps<{
  email: Email;
}>();

const _emit = defineEmits(['toggle-reply', 'archive', 'spam', 'delete', 'mark-unread', 'toggle-label', 'toggle-favorite']);

const _router = useRouter();

const { data: _allLabels } = useFetch<string[]>('/api/labels');

const _showSnoozeModal = ref(false);

</script>

<template>
  <div class="p-2 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-2">
    <button @click="_router.back()" class="flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-zinc-800 p-2 rounded-lg">
      <Icon name="mdi:arrow-left" class="text-xl" />
    </button>
    <div class="flex items-center gap-2">
      <button @click="_emit('archive')" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:archive-outline" class="text-xl" />
      </button>
      <button @click="_emit('spam')" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:alert-octagon-outline" class="text-xl" />
      </button>
      <button @click="_emit('delete')" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:trash-can-outline" class="text-xl" />
      </button>
      <button @click="_showSnoozeModal = true" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:clock-outline" class="text-xl" />
      </button>
      <button @click="_emit('mark-unread')" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:email-mark-as-unread" class="text-xl" />
      </button>
      <div class="border-l border-slate-200 dark:border-zinc-700 h-6 mx-2"></div>
      <div class="relative group">
        <button class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
          <Icon name="mdi:tag-outline" class="text-xl" />
        </button>
        <div class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md shadow-lg p-2 z-10 hidden group-hover:block">
          <ul>
            <li v-for="label in _allLabels" :key="label">
              <div @click="_emit('toggle-label', label)" class="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 cursor-pointer">
                <Icon name="mdi:check" class="text-lg" :class="{ 'opacity-0': !email?.labels.includes(label) }" />
                <span>{{ label }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <button @click="_emit('toggle-reply')" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:reply" class="text-xl" />
      </button>
      <button class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:forward" class="text-xl" />
      </button>
      <button @click="_emit('toggle-favorite')" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon :name="email?.favorited ? 'mdi:star' : 'mdi:star-outline'" class="text-xl" :class="{'text-yellow-500': email?.favorited}" />
      </button>
      <button class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="mdi:dots-vertical" class="text-xl" />
      </button>
    </div>
  </div>
  <SnoozeModal v-if="_showSnoozeModal" :email="email" @close="_showSnoozeModal = false" />
</template>
