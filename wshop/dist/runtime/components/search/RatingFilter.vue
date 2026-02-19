<template>
  <div class="space-y-2">
    <!-- Star rating filter options -->
    <div v-for="n in 5" :key="n" class="flex items-center">
      <input type="checkbox" :id="`star-${n}`" />
      <label :for="`star-${n}`" class="ml-2">{{ n }} Stars & Up</label>
    </div>
  </div>
</template>
