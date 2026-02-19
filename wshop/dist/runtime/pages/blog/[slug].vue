<script setup>
import { useFetch, useRoute, useHead, createError } from "#imports";
const route = useRoute();
const slug = route.params.slug;
const { data: post, pending, error } = await useFetch(`/api/posts/${slug}`);
if (error.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found", fatal: true });
}
useHead(() => {
  if (!post.value) return { title: "Blog Post" };
  return {
    title: post.value.title,
    meta: [{ name: "description", content: post.value.excerpt || "" }]
  };
});
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
const renderContent = (content) => {
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch (e) {
      return `<p>${content}</p>`;
    }
  }
  if (Array.isArray(content)) {
    if (Array.isArray(content)) {
      return content.map((block) => {
        if (typeof block === "object" && block !== null && "content" in block && typeof block.content === "string") {
          return `<p>${block.content}</p>`;
        }
        return "";
      }).join("");
    }
  }
  return "";
};
</script>

<template>
  <div class="container mx-auto p-8">
    <div v-if="pending">
      <p>Loading post...</p>
    </div>
    <div v-else-if="error || !post">
      <p class="text-red-500">Could not load the post.</p>
    </div>
    <div v-else class="max-w-4xl mx-auto">
      <article>
        <header class="mb-8">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ post.title }}</h1>
          <div class="text-sm text-gray-500">
            <span>By {{ post.author?.name || "Staff" }}</span>
            <span class="mx-2">•</span>
            <span>{{ formatDate(post.publishedAt) }}</span>
          </div>
        </header>

        <img v-if="post.featuredImage" :src="post.featuredImage" :alt="post.title" class="w-full rounded-lg shadow-lg mb-8">

        <!-- Post Content -->
        <div class="prose lg:prose-xl max-w-none" v-html="renderContent(post.content)"></div>
      </article>
    </div>
  </div>
</template>
