<script setup lang="ts">
import { useSearch } from '../../composables/useUtilities'

const { search, searchInChat, isSearching, searchHistory, clearHistory } = useSearch()

const isOpen = ref(false)
const searchQuery = ref('')
const activeTab = ref<'messages' | 'media' | 'links' | 'files'>('messages')
const selectedChat = ref<string | null>(null)

const hasHistory = computed(() => searchHistory.value.length > 0)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  if (selectedChat.value) {
    await searchInChat(selectedChat.value, searchQuery.value)
  } else {
    await search({ query: searchQuery.value })
  }
}

const selectHistoryItem = (query: string) => {
  searchQuery.value = query
  handleSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div>
    <!-- Search Trigger -->
    <MoleculesInputSearch
      v-model="searchQuery"
      placeholder="Search messages, chats..."
      class="w-full"
      @focus="isOpen = true"
      @keyup.enter="handleSearch"
    >
      <template #prefix>
        <span class="i-lucide-search w-4 h-4 text-muted" />
      </template>
      <template v-if="searchQuery" #suffix>
        <AtomsButton variant="ghost" size="icon-xs" @click="clearSearch">
          <span class="i-lucide-x w-4 h-4" />
        </AtomsButton>
      </template>
    </MoleculesInputSearch>

    <!-- Search Dialog -->
    <MoleculesDialog v-model:open="isOpen">
      <MoleculesDialogContent class="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <MoleculesDialogHeader>
          <MoleculesDialogTitle>Search</MoleculesDialogTitle>
        </MoleculesDialogHeader>

        <!-- Search Input -->
        <div class="flex items-center gap-2 px-4 py-3 border-b">
          <span class="i-lucide-search w-5 h-5 text-muted" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="flex-1 bg-transparent outline-none"
            @keyup.enter="handleSearch"
          >
          <AtomsBadge v-if="isSearching" variant="secondary" size="sm">
            Searching...
          </AtomsBadge>
        </div>

        <!-- Filter Tabs -->
        <MoleculesTabs v-model="activeTab" class="w-full">
          <MoleculesTabsList class="grid w-full grid-cols-4">
            <MoleculesTabsTrigger value="messages">
              <span class="i-lucide-message-square w-4 h-4 mr-2" />
              Messages
            </MoleculesTabsTrigger>
            <MoleculesTabsTrigger value="media">
              <span class="i-lucide-image w-4 h-4 mr-2" />
              Media
            </MoleculesTabsTrigger>
            <MoleculesTabsTrigger value="links">
              <span class="i-lucide-link w-4 h-4 mr-2" />
              Links
            </MoleculesTabsTrigger>
            <MoleculesTabsTrigger value="files">
              <span class="i-lucide-file w-4 h-4 mr-2" />
              Files
            </MoleculesTabsTrigger>
          </MoleculesTabsList>

          <!-- Search History -->
          <div v-if="!searchQuery && hasHistory" class="p-4">
            <div class="flex items-center justify-between mb-2">
              <AtomsText size="sm" class="text-muted">Recent Searches</AtomsText>
              <AtomsButton variant="ghost" size="sm" @click="clearHistory">
                Clear
              </AtomsButton>
            </div>
            <div class="flex flex-wrap gap-2">
              <AtomsChip
                v-for="query in searchHistory"
                :key="query"
                variant="secondary"
                class="cursor-pointer"
                @click="selectHistoryItem(query)"
              >
                {{ query }}
              </AtomsChip>
            </div>
          </div>

          <!-- Search Results -->
          <div v-else-if="searchQuery" class="flex-1 overflow-y-auto p-4">
            <!-- Results content would be populated here -->
            <div class="text-center text-muted py-8">
              <span class="i-lucide-search w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Search results will appear here</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-muted">
            <span class="i-lucide-search w-16 h-16 mb-4 opacity-30" />
            <p>Start typing to search</p>
            <p class="text-sm mt-1">Search in messages, media, links, and files</p>
          </div>
        </MoleculesTabs>
      </MoleculesDialogContent>
    </MoleculesDialog>
  </div>
</template>
