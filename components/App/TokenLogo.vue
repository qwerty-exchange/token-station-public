<script lang="ts" setup>
const props = defineProps({
  src: String
})
const attrs = useAttrs()
const imageSrc = props.src

const imageLoadOnError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/icons/injective.svg'
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <img v-bind="attrs" :src="imageSrc" @error="imageLoadOnError" />
</template>
