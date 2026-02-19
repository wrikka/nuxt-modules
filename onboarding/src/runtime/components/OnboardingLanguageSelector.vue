<script setup lang="ts">
import { ref, computed } from 'vue';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface Props {
  languages?: Language[];
  currentLanguage?: string;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  languages: () => [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  ],
  currentLanguage: 'en',
  show: true,
});

const emit = defineEmits<{
  select: [languageCode: string];
  close: [];
}>();

const searchQuery = ref('');

const filteredLanguages = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.languages.filter(lang =>
    lang.name.toLowerCase().includes(query) ||
    lang.nativeName.toLowerCase().includes(query) ||
    lang.code.toLowerCase().includes(query),
  );
});

const selectLanguage = (language: Language) => {
  emit('select', language.code);
  emit('close');
};
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
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Select Language
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred language
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

            <div class="mb-6">
              <div class="relative">
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search languages..."
                  class="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div class="max-h-96 overflow-y-auto space-y-2">
              <button
                v-for="language in filteredLanguages"
                :key="language.code"
                class="w-full p-4 rounded-xl text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between group"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500': language.code === currentLanguage,
                }"
                @click="selectLanguage(language)"
              >
                <div class="flex items-center gap-4">
                  <span class="text-3xl">{{ language.flag }}</span>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">
                      {{ language.nativeName }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ language.name }}
                    </p>
                  </div>
                </div>
                <div v-if="language.code === currentLanguage" class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <svg
                  v-else
                  class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div v-if="filteredLanguages.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">
                No languages found
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
