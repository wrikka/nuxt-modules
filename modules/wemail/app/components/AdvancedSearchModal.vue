<script setup lang="ts">
const _showModal = ref(false);
const _searchQuery = ref('');
const { parseQuery, buildQuery, search, suggestions } = useAdvancedSearch();

const _showSuggestions = ref(false);
const _activeSuggestion = ref(0);

const _operators = [
  { key: 'from:', label: 'From', example: 'from:john@example.com' },
  { key: 'to:', label: 'To', example: 'to:jane@example.com' },
  { key: 'subject:', label: 'Subject', example: 'subject:"Meeting Notes"' },
  { key: 'has:', label: 'Has', example: 'has:attachment' },
  { key: 'is:', label: 'Is', example: 'is:starred' },
  { key: 'in:', label: 'In folder', example: 'in:sent' },
  { key: 'after:', label: 'After date', example: 'after:2024-01-01' },
  { key: 'before:', label: 'Before date', example: 'before:2024-12-31' },
  { key: 'label:', label: 'Label', example: 'label:work' },
];

const _filteredOperators = computed(() => {
  if (!_searchQuery.value.includes(':')) return [];
  const current = _searchQuery.value.toLowerCase();
  return _operators.filter(op => current.includes(op.key.toLowerCase()));
});

const _handleSearch = async () => {
  if (!_searchQuery.value.trim()) return;
  await search(_searchQuery.value);
  navigateTo(`/search?q=${encodeURIComponent(_searchQuery.value)}`);
  _showModal.value = false;
};

const _insertOperator = (op: typeof _operators[0]) => {
  _searchQuery.value += op.key;
  _showSuggestions.value = false;
};

const _handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    _handleSearch();
  } else if (e.key === 'Escape') {
    _showModal.value = false;
  }
};
</script>

<template>
  <div>
    <button
      @click="_showModal = true"
      class="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 text-sm"
    >
      <Icon name="mdi:magnify" />
      <span>Advanced Search</span>
    </button>

    <div
      v-if="_showModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
      @click="_showModal = false"
    >
      <div
        class="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden"
        @click.stop
      >
        <div class="p-4 border-b border-slate-200 dark:border-zinc-700">
          <div class="flex items-center gap-3">
            <Icon name="mdi:magnify" class="text-2xl text-slate-400" />
            <input
              v-model="_searchQuery"
              @keydown="_handleKeydown"
              placeholder="Search with operators (from:, subject:, has:attachment...)"
              class="flex-1 text-lg outline-none bg-transparent"
              autofocus
            />
            <button
              @click="_showModal = false"
              class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full"
            >
              <Icon name="mdi:close" />
            </button>
          </div>
        </div>

        <div class="p-4 max-h-96 overflow-y-auto">
          <div class="mb-4">
            <h3 class="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Search Operators</h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="op in _operators"
                :key="op.key"
                @click="_insertOperator(op)"
                class="text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm"
              >
                <span class="font-mono text-blue-500">{{ op.key }}</span>
                <span class="text-slate-500 dark:text-zinc-400 ml-2">{{ op.label }}</span>
              </button>
            </div>
          </div>

          <div v-if="_searchQuery" class="border-t border-slate-200 dark:border-zinc-700 pt-4">
            <h3 class="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Preview</h3>
            <div class="text-sm text-slate-600 dark:text-zinc-300">
              {{ parseQuery(_searchQuery) }}
            </div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-zinc-800 border-t border-slate-200 dark:border-zinc-700 flex justify-between items-center">
          <span class="text-sm text-slate-500">Press Enter to search</span>
          <button
            @click="_handleSearch"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
