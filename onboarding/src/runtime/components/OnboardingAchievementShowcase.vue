<script setup lang="ts">
import { ref, computed } from 'vue';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Props {
  badges?: Badge[];
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  badges: () => [],
  show: true,
});

const emit = defineEmits<{
  close: [];
  'view-badge': [badge: Badge];
}>();

const selectedBadge = ref<Badge | null>(null);

const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'legendary':
      return 'from-yellow-400 to-orange-500';
    case 'epic':
      return 'from-purple-400 to-pink-500';
    case 'rare':
      return 'from-blue-400 to-cyan-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
};

const getRarityBorder = (rarity: string): string => {
  switch (rarity) {
    case 'legendary':
      return 'border-yellow-500';
    case 'epic':
      return 'border-purple-500';
    case 'rare':
      return 'border-blue-500';
    default:
      return 'border-gray-400';
  }
};

const selectBadge = (badge: Badge) => {
  selectedBadge.value = badge;
  emit('view-badge', badge);
};

const earnedBadges = computed(() => props.badges.filter(b => b.earnedAt));
const lockedBadges = computed(() => props.badges.filter(b => !b.earnedAt));
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Achievement Showcase
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ earnedBadges.length }} / {{ badges.length }} badges earned
                  </p>
                </div>
              </div>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="emit('close')"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="earnedBadges.length > 0" class="mb-8">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Earned Badges
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="badge in earnedBadges"
                  :key="badge.id"
                  class="relative group cursor-pointer"
                  @click="selectBadge(badge)"
                >
                  <div
                    class="aspect-square rounded-2xl bg-gradient-to-br p-4 flex flex-col items-center justify-center border-2 transition-all hover:scale-105"
                    :class="[getRarityColor(badge.rarity), getRarityBorder(badge.rarity)]"
                  >
                    <div class="text-4xl mb-2">{{ badge.icon }}</div>
                    <p class="text-white font-semibold text-sm text-center">
                      {{ badge.name }}
                    </p>
                  </div>
                  <div class="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            <div v-if="lockedBadges.length > 0">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Locked Badges
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="badge in lockedBadges"
                  :key="badge.id"
                  class="relative opacity-50"
                >
                  <div
                    class="aspect-square rounded-2xl bg-gradient-to-br p-4 flex flex-col items-center justify-center border-2"
                    :class="[getRarityColor(badge.rarity), getRarityBorder(badge.rarity)]"
                  >
                    <div class="text-4xl mb-2 grayscale">{{ badge.icon }}</div>
                    <p class="text-white font-semibold text-sm text-center">
                      {{ badge.name }}
                    </p>
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
