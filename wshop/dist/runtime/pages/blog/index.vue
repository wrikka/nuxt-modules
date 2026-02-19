<script setup>
import { useFetch, useHead } from "#imports";
const { data: posts, pending, error } = await useFetch("/api/posts", {
  // In a real app, you might want to filter for published posts on the server-side
  // For now, we filter on the client-side for simplicity.
  transform: (posts2) => posts2.filter((p) => p.status === "published")
});
useHead({
  title: "Our Blog",
  meta: [{ name: "description", content: "Latest news and articles from our store." }]
});
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-4xl font-bold mb-8 text-center">Our Blog</h1>

    <div v-if="pending">
      <p>Loading posts...</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Failed to load posts.</p>
    </div>
    <div v-else-if="!posts || posts.length === 0">
      <p class="text-center text-gray-500">No blog posts have been published yet. Check back soon!</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <NuxtLink :to="`/blog/${post.slug}`">
          <img :src="post.featuredImage || '/placeholder.svg'" :alt="post.title" class="w-full h-48 object-cover">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-2">{{ post.title }}</h2>
            <p class="text-gray-600 text-sm mb-4">{{ post.excerpt }}</p>
            <div class="text-xs text-gray-500">
              <span>By {{ post.author?.name || "Staff" }}</span>
              <span class="mx-2">•</span>
              <span>{{ formatDate(post.publishedAt) }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
