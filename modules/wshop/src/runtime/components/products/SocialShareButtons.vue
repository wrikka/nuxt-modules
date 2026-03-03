<script setup lang="ts">
const props = defineProps({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
});

const encodedUrl = computed(() => encodeURIComponent(props.url));
const encodedTitle = computed(() => encodeURIComponent(props.title));
const encodedDescription = computed(() => encodeURIComponent(props.description));
const encodedImageUrl = computed(() => encodeURIComponent(props.imageUrl));

const facebookUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`);
const twitterUrl = computed(() => `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`);
const pinterestUrl = computed(() => `https://pinterest.com/pin/create/button/?url=${encodedUrl.value}&media=${encodedImageUrl.value}&description=${encodedDescription.value}`);

const openSharePopup = (url: string) => {
  window.open(url, 'Share', 'width=600,height=400');
};

</script>

<template>
  <div class="flex items-center gap-4 mt-6">
    <span class="text-sm font-medium text-gray-600">Share:</span>
    <button @click="openSharePopup(facebookUrl)" aria-label="Share on Facebook" class="text-gray-500 hover:text-blue-600">
      <Icon name="fa6-brands:facebook-f" class="w-5 h-5" />
    </button>
    <button @click="openSharePopup(twitterUrl)" aria-label="Share on Twitter" class="text-gray-500 hover:text-blue-400">
      <Icon name="fa6-brands:twitter" class="w-5 h-5" />
    </button>
    <button @click="openSharePopup(pinterestUrl)" aria-label="Share on Pinterest" class="text-gray-500 hover:text-red-600">
      <Icon name="fa6-brands:pinterest-p" class="w-5 h-5" />
    </button>
  </div>
</template>
