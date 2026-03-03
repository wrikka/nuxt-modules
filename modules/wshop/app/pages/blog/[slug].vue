<script setup lang="ts">
import { useFetch, useRoute, useHead, createError } from '#imports';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: unknown; // Assuming JSON content for now
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  author: { name: string | null } | null;
}

const route = useRoute();
const slug = route.params.slug as string;

const { data: post, pending, error } = await useFetch<Post>(`/api/posts/${slug}`);

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

useHead(() => {
  if (!post.value) return { title: 'Blog Post' };
  return {
    title: post.value.title,
    meta: [{ name: 'description', content: post.value.excerpt || '' }],
  };
});

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

// A simple renderer for JSON content. In a real app, you'd use a more robust
// library like TipTap's renderer to convert JSON to HTML.
const renderContent = (content: unknown): string => {
    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch (e) {
            return `<p>${content}</p>`; // Treat as plain text if not valid JSON
        }
    }
    if (Array.isArray(content)) {
            if (Array.isArray(content)) {
        return content.map(block => {
            if (typeof block === 'object' && block !== null && 'content' in block && typeof block.content === 'string') {
                return `<p>${block.content}</p>`;
            }
            return '';
        }).join('');
    }
    }
    return '';
}

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
            <span>By {{ post.author?.name || 'Staff' }}</span>
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
