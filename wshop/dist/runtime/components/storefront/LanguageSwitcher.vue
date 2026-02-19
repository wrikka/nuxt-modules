<template>
  <div class="relative">
    <select v-model="locale" @change="updateLocale" class="border rounded px-3 py-2 text-sm">
      <option value="en">English</option>
      <option value="th">ไทย</option>
    </select>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const updateLocale = () => {
};
</script>
