<script lang="ts" setup>
defineProps({
  files: Array<{ name: string; file: string }>
})

const isVisible = ref(false)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

const buttonRef = ref<HTMLDivElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  console.log(1)
  const element = event.target as Element
  if (element == buttonRef.value || element.parentNode == buttonRef.value) {
    return
  }
  isVisible.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative">
    <div ref="buttonRef">
      <AppButton class="bg-gray-750 font-semibold" @click="toggleVisibility">
        Download
      </AppButton>
    </div>
    <div
      v-if="isVisible"
      class="absolute z-10 top-full right-0 border border-gray-300 mt-2 bg-white py-1 min-w-[90px]"
    >
      <a
        v-for="file in files"
        class="text-right block hover:bg-gray-100 px-4 cursor-pointer text-gray-500"
        :href="file.file"
        download
      >
        {{ file.name }}
      </a>
    </div>
  </div>
</template>
