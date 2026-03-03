<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, definePageMeta } from '#imports';

interface Post {
  title: string;
  slug: string;
  content: unknown; // For a JSON-based editor
  excerpt: string;
  featuredImage: string;
  status: 'draft' | 'published';
}

definePageMeta({ layout: 'admin' });

const router = useRouter();
const post = ref<Partial<Post>>({
  title: '',
  slug: '',
  content: '[]',
  excerpt: '',
  featuredImage: '',
  status: 'draft',
});
const error = ref<string | null>(null);
const isLoading = ref(false);

// Auto-generate slug from title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/--+/g, '-'); // remove consecutive hyphens
};

watch(() => post.value.title, (newTitle) => {
  if (newTitle) {
    post.value.slug = generateSlug(newTitle);
  }
});

const handleSubmit = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    let contentToSave = post.value.content;
    try {
        contentToSave = JSON.parse(contentToSave as string);
    } catch (e) {
        // Keep as string if not valid JSON
    }
    await $fetch('/api/posts', {
      method: 'POST',
      body: { ...post.value, content: contentToSave },
    });
    await router.push('/admin/blog');
  } catch (err: unknown) {
    const h3Error = err as { data?: { message?: string } };
    error.value = h3Error.data?.message || 'Failed to create post.';
  } finally {
    isLoading.value = false;
  }
};

</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Create New Post</h1>
      <NuxtLink to="/admin/blog" class="text-gray-600 hover:underline">Cancel</NuxtLink>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input id="title" v-model="post.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>

          <!-- Content -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
            <textarea id="content" v-model="post.content as string" rows="10" placeholder="JSON content for now..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono"></textarea>
          </div>

          <!-- Excerpt -->
          <div>
            <label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt</label>
            <textarea id="excerpt" v-model="post.excerpt" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Slug -->
          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700">URL Slug</label>
            <input id="slug" v-model="post.slug" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50">
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" v-model="post.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <!-- Featured Image -->
          <div>
            <label for="featuredImage" class="block text-sm font-medium text-gray-700">Featured Image URL</label>
            <input id="featuredImage" v-model="post.featuredImage" type="text" placeholder="https://..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
        </div>
      </div>

      <!-- Submission -->
      <div class="border-t pt-4">
        <button type="submit" :disabled="isLoading" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
          {{ isLoading ? 'Saving...' : 'Save Post' }}
        </button>
        <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </div>
    </form>
  </div>
</template>
