<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

const outline = computed(() => {
  if (!page.value?.body?.toc?.links) return []
  return page.value.body.toc.links
})

const activeHeading = ref('')

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeHeading.value = entry.target.id
      }
    })
  }, { rootMargin: '-80px 0px -80% 0px' })

  outline.value.forEach((heading: any) => {
    const el = document.getElementById(heading.id)
    if (el) observer.observe(el)
  })
})
</script>

<template>
  <nav class="docs-outline hidden xl:block">
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">On this page</div>
    <ul class="docs-outline-list">
      <li v-for="heading in outline" :key="heading.id">
        <a
          :href="'#' + heading.id"
          class="docs-outline-link"
          :class="[
            heading.depth === 3 ? 'docs-outline-link-h3' : 'docs-outline-link-h2',
            { 'docs-outline-link-active': activeHeading === heading.id }
          ]"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
