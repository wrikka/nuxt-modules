<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "website",
});

useHead(() => ({
  meta: [
    { property: "og:title", content: props.title },
    { property: "og:description", content: props.description },
    { property: "og:type", content: props.type },
    { property: "og:image", content: props.image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: props.title },
    { name: "twitter:description", content: props.description },
    { name: "twitter:image", content: props.image },
  ].filter(m => m.content),
}));
</script>

<template>
  <!-- OG Image meta tags are injected via useHead -->
  <slot />
</template>
