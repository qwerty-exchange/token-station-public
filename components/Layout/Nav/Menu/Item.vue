<script lang="ts" setup>
import { BusEvents } from '@/types'

const props = defineProps({
  dense: Boolean,
  target: {
    type: String,
    default: '_self'
  }
})

const attrs = useAttrs()

const classes = computed(() => {
  if (props.dense) {
    return ['hover:text-blue-500']
  }

  return ['px-6', 'py-2', 'hover:bg-gray-800', 'hover:text-white']
})

function handleVisit() {
  useEventBus<string>(BusEvents.NavLinkClicked).emit()
}
</script>

<template>
  <NuxtLink
    :target="target"
    v-bind="$attrs"
    class="text-gray-200 hover:bg-gray-800 hover:text-white text-sm font-semibold rounded-lg cursor-pointer mx-px h-10 flex items-center"
    :class="classes"
    exact
    @click="handleVisit"
  >
    <span class="block">
      <slot></slot>
    </span>
  </NuxtLink>
</template>
