<script setup lang="ts">
const { attachments, isUploading, error, addAttachment, removeAttachment, formattedTotalSize, isImage, getFileIcon } = useAttachments();
const _fileInput = ref<HTMLInputElement | null>(null);

const _triggerFileInput = () => {
  _fileInput.value?.click();
};

const _handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  for (const file of files) {
    await addAttachment(file);
  }

  // Reset input
  target.value = '';
};

const _handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (!files) return;

  for (const file of files) {
    await addAttachment(file);
  }
};

const _handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};
</script>

<template>
  <div
    class="border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-lg p-4"
    @drop="_handleDrop"
    @dragover="_handleDragOver"
  >
    <input
      ref="_fileInput"
      type="file"
      multiple
      class="hidden"
      @change="_handleFileChange"
      accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
    />

    <div v-if="attachments.length === 0" class="text-center py-4">
      <Icon name="mdi:cloud-upload" class="text-4xl text-slate-400 mb-2" />
      <p class="text-sm text-slate-500 dark:text-zinc-400">
        Drag and drop files here, or
        <button
          @click="_triggerFileInput"
          class="text-blue-500 hover:underline"
        >
          browse
        </button>
      </p>
      <p class="text-xs text-slate-400 mt-1">Max 10MB per file</p>
    </div>

    <div v-else class="space-y-2">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Attachments ({{ attachments.length }})</span>
        <span class="text-xs text-slate-500">{{ formattedTotalSize }}</span>
      </div>

      <div class="grid gap-2">
        <div
          v-for="att in attachments"
          :key="att.id"
          class="flex items-center gap-3 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg group"
        >
          <div class="w-10 h-10 rounded-lg bg-slate-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <Icon
              v-if="isImage(att) && att.data"
              :name="getFileIcon(att)"
              class="text-2xl"
            />
            <img
              v-else-if="isImage(att) && att.data"
              :src="att.data"
              class="w-full h-full object-cover rounded-lg"
              alt=""
            />
            <Icon
              v-else
              :name="getFileIcon(att)"
              class="text-2xl text-slate-500"
            />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ att.name }}</p>
            <p class="text-xs text-slate-500">{{ useAttachments().formatFileSize(att.size) }}</p>
          </div>

          <button
            @click="removeAttachment(att.id)"
            class="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon name="mdi:close" class="text-lg" />
          </button>
        </div>
      </div>

      <button
        @click="_triggerFileInput"
        class="w-full py-2 border border-dashed border-slate-300 dark:border-zinc-600 rounded-lg text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800"
      >
        + Add more files
      </button>
    </div>

    <div v-if="error" class="mt-2 text-sm text-red-500">
      {{ error }}
    </div>

    <div v-if="isUploading" class="mt-2 text-sm text-blue-500 flex items-center gap-2">
      <Icon name="mdi:loading" class="animate-spin" />
      Uploading...
    </div>
  </div>
</template>
