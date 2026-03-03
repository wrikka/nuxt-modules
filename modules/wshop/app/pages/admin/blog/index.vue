<script setup lang="ts">
import { useFetch, definePageMeta } from '#imports';

// Define a simplified type for the post list
interface PostListItem {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  author: { name: string | null } | null;
  createdAt: string;
}

definePageMeta({ layout: 'admin' });

const { data: posts, pending, error, refresh } = await useFetch<PostListItem[]>('/api/posts');

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const deletePost = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the post "${title}"?`)) return;
    try {
        await $fetch(`/api/posts/${slug}`, { method: 'DELETE' });
        await refresh();
        alert('Post deleted successfully.');
    } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post.');
    }
}

</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Blog Posts</h1>
      <NuxtLink to="/admin/blog/new" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Post
      </NuxtLink>
    </div>

    <div v-if="pending">
      <p>Loading posts...</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Failed to load posts.</p>
    </div>
    <div v-else-if="!posts || posts.length === 0">
        <p class="text-gray-500">No posts found. Create one to get started.</p>
    </div>
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in posts" :key="post.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ post.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ post.author?.name || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ post.status }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(post.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink :to="`/admin/blog/${post.slug}`" class="text-indigo-600 hover:text-indigo-900">Edit</NuxtLink>
              <button @click="deletePost(post.slug, post.title)" class="text-red-600 hover:text-red-900 ml-4">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
