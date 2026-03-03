<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">เขียนรีวิวสินค้า</h3>
      <form @submit.prevent="submitReview">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">คะแนน *</label>
            <StarRating
              v-model:rating="reviewForm.rating"
              :interactive="true"
              :size="32"
              class="justify-center"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">หัวข้อรีวิว</label>
            <input
              v-model="reviewForm.title"
              type="text"
              placeholder="สรุปประสบการณ์ของคุณ"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียดรีวิว *</label>
            <textarea
              v-model="reviewForm.content"
              rows="4"
              placeholder="แชร์รายละเอียดเกี่ยวกับสินค้า..."
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">รูปภาพ (ไม่จำเป็น)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleImageUpload"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div v-if="reviewForm.images.length > 0" class="flex space-x-2 mt-2">
              <div
                v-for="(image, index) in reviewForm.images"
                :key="index"
                class="relative"
              >
                <img
                  :src="image"
                  :alt="`Preview ${index + 1}`"
                  class="w-16 h-16 object-cover rounded"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <NuxtIcon name="i-mdi-close" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="processing || !reviewForm.rating || !reviewForm.content"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            ส่งรีวิว
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarRating from './StarRating.vue'

interface Props {
  show: boolean
  processing?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: {
    rating: number
    title: string
    content: string
    images: string[]
  }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const reviewForm = ref({
  rating: 0,
  title: '',
  content: '',
  images: [] as string[]
})

const handleImageUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          reviewForm.value.images.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index: number) => {
  reviewForm.value.images.splice(index, 1)
}

const submitReview = () => {
  emit('submit', { ...reviewForm.value })
  reset()
}

const close = () => {
  emit('close')
  reset()
}

const reset = () => {
  reviewForm.value = {
    rating: 0,
    title: '',
    content: '',
    images: []
  }
}
</script>
