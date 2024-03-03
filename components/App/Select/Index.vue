<script lang="ts" setup>
import { PropType } from 'vue'
import { BaseDropdownOption } from '@injectivelabs/ui-shared/lib/types'

const props = defineProps({
  options: {
    type: Array as PropType<BaseDropdownOption[]>,
    required: true
  },

  modelValue: {
    type: String,
    default: ''
  },

  wrapperClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', state: string): void
}>()

const uuid = Math.random()

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue)
)

function handleSelect(option: BaseDropdownOption) {
  emit('update:modelValue', option.value)
}
</script>

<template>
  <BaseDropdown
    popper-class="selector min-w-40"
    placement="bottom-start"
    :flip="false"
  >
    <template #default="{ isOpen }">
      <div class="flex items-center gap-2" :class="wrapperClass">
        <slot name="prefix" />

        <slot :selected="selectedOption" />

        <slot name="icon" :shown="isOpen">
          <BaseIcon
            name="chevron-down"
            class="h-3 w-3 min-w-3 fill-current"
            :class="{
              'ease-in-out duration-300': isOpen,
              'rotate-180': isOpen,
              'rotate-0': !isOpen
            }"
          />
        </slot>
      </div>
    </template>

    <template #content="{ close }">
      <div class="bg-white text-gray-900 rounded-lg p-2 flex flex-col">
        <div
          v-for="(option, index) in options"
          :key="`${uuid}-selector-${index}`"
          class="flex items-center px-2 py-1 cursor-pointer rounded"
          :class="[
            option.value === modelValue
              ? 'text-gray-900 bg-gray-200  hover:bg-gray-200'
              : 'text-gray-900 hover:bg-gray-200 '
          ]"
          @click="
            () => {
              handleSelect(option)
              close()
            }
          "
        >
          <slot name="option" :option="option" />
        </div>
      </div>
    </template>
  </BaseDropdown>
</template>
