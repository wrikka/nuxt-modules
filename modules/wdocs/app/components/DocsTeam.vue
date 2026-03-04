<script setup lang="ts">
const props = defineProps<{
  members?: Array<{
    name: string
    role: string
    avatar?: string
    link?: string
  }>
}>()

const defaultMembers = [
  { name: 'John Doe', role: 'Creator', avatar: '' },
  { name: 'Jane Smith', role: 'Developer', avatar: '' }
]

const displayMembers = computed(() => props.members || defaultMembers)
</script>

<template>
  <div class="docs-team-grid">
    <a
      v-for="(member, index) in displayMembers"
      :key="index"
      :href="member.link"
      :target="member.link ? '_blank' : undefined"
      rel="noopener"
      class="docs-team-card"
    >
      <div class="docs-team-avatar">
        <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="w-full h-full object-cover rounded-full">
        <Icon v-else name="lucide:user" class="w-12 h-12 text-gray-400 m-auto" />
      </div>
      <div class="docs-team-name">{{ member.name }}</div>
      <div class="docs-team-role">{{ member.role }}</div>
    </a>
  </div>
</template>
