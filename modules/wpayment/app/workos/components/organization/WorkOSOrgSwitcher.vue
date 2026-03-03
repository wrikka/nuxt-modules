<template>
  <div class="org-switcher" ref="dropdownRef">
    <button class="switcher-trigger" @click="toggleDropdown">
      <div class="current-org">
        <div class="org-avatar">{{ displayOrg?.name?.charAt(0) || "?" }}</div>
        <div class="org-details">
          <span class="org-name">{{ displayOrg?.name || "Select Organization" }}</span>
          <span v-if="showRole && currentRole" class="org-role">{{ currentRole }}</span>
        </div>
      </div>
      <svg
        class="chevron"
        :class="{ open: isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="switcher-dropdown">
        <!-- Search -->
        <div class="dropdown-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search organizations..." />
        </div>

        <!-- Organization List -->
        <div class="dropdown-list">
          <div
            v-for="org in filteredOrgs"
            :key="org.id"
            class="org-item"
            :class="{ active: org.id === currentOrg?.id, disabled: org.id === currentOrg?.id }"
            @click="selectOrg(org)"
          >
            <div class="org-avatar" :style="{ background: getOrgColor(org.id) }">
              {{ org.name.charAt(0) }}
            </div>
            <div class="org-info">
              <span class="org-name">{{ org.name }}</span>
              <span class="org-meta">{{ (org as any).memberCount || 0 }} members</span>
            </div>
            <svg
              v-if="org.id === currentOrg?.id"
              class="check-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div v-if="filteredOrgs.length === 0" class="empty-state">
            <p>No organizations found</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="dropdown-footer">
          <button class="footer-btn" @click="createNewOrg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Organization
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import type { Organization } from "../shared/types"

interface Props {
  currentOrg?: Organization | null
  organizations?: Organization[]
  showRole?: boolean
  currentRole?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentOrg: null,
  organizations: () => [],
  showRole: false,
  currentRole: "",
})

const emit = defineEmits<{
  switch: [orgId: string]
  create: []
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref("")

const displayOrg = computed(() => props.currentOrg)

const filteredOrgs = computed(() => {
  if (!searchQuery.value) return props.organizations
  const query = searchQuery.value.toLowerCase()
  return props.organizations.filter((org) => org.name.toLowerCase().includes(query))
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ""
  }
}

const selectOrg = (org: Organization) => {
  if (org.id !== props.currentOrg?.id) {
    emit("switch", org.id)
  }
  isOpen.value = false
}

const createNewOrg = () => {
  emit("create")
  isOpen.value = false
}

const getOrgColor = (id: string): string => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index] ?? "#3b82f6"
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<style scoped>
.org-switcher {
  position: relative;
  display: inline-block;
}

.switcher-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.switcher-trigger:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.current-org {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.org-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.org-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.org-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.org-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.chevron {
  color: #9ca3af;
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

.switcher-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 280px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgb(0 0 0 / 0.1);
  z-index: 50;
  overflow: hidden;
}

.dropdown-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-search svg {
  color: #9ca3af;
  flex-shrink: 0;
}

.dropdown-search input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.875rem;
}

.dropdown-list {
  max-height: 240px;
  overflow-y: auto;
}

.org-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.15s;
}

.org-item:hover:not(.disabled) {
  background: #f9fafb;
}

.org-item.active {
  background: #eff6ff;
}

.org-item.disabled {
  cursor: default;
  opacity: 0.7;
}

.org-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.org-info .org-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.org-meta {
  font-size: 0.75rem;
  color: #6b7280;
}

.check-icon {
  color: #3b82f6;
}

.empty-state {
  padding: 2rem;
  text-align: center;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.dropdown-footer {
  padding: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background 0.15s;
}

.footer-btn:hover {
  background: #eff6ff;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
