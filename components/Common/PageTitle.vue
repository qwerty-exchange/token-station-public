<script setup lang="ts">
const { title } = defineProps({
  title: String,

  subtitle: {
    type: String
  }
})
</script>

<template>
  <div class="mb-8 text-black">
    <p class="font-bold text-3xl">{{ title }}</p>
    <p class="text-lg text-gray-600">{{ subtitle }}</p>
  </div>
</template>
