<script lang="ts" setup>
defineProps({
  value: {
    type: String,
    required: true
  },

  modelValue: {
    type: String,
    required: true
  }
})
</script>

<template>
  <BaseSelectorItem :model-value="modelValue" :value="value" v-bind="$attrs">
    <template #default="{ isActive }">
      <div class="cursor-pointer">
        <slot :active="isActive" />
      </div>
    </template>
  </BaseSelectorItem>
</template>
