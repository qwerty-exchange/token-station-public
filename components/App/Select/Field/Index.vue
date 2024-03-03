<script lang="ts" setup>
import { PropType } from 'vue'
import { BaseDropdownOption } from '@injectivelabs/ui-shared/lib/types'

const props = defineProps({
  clearable: Boolean,
  searchable: Boolean,

  options: {
    type: Array as PropType<BaseDropdownOption[]>,
    default: () => []
  },

  modelValue: {
    type: String,
    default: ''
  },

  placeholder: {
    type: String,
    default: 'Select'
  },

  selectedClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', state: string): void
}>()

const uuid = Math.random()
const search = ref('')

const value = computed({
  get: (): string | undefined => props.modelValue,
  set: (value?: string) => {
    if (value) {
      emit('update:modelValue', value)
    }
  }
})

const selectedItem = computed(() =>
  props.options.find(({ value }) => value === props.modelValue)
)

const filteredList = computed(() => {
  return props.options
    .filter((option) => {
      return (option.display + option.value)
        .toLocaleLowerCase()
        .includes(search.value.toLocaleLowerCase().trim())
    })
    .filter((el) => el.value !== selectedItem.value?.value)
})

function handleClear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <BaseDropdown
    class="w-full"
    placement="bottom-start"
    :delay="300"
    popper-class="bg-white shadow-helix"
  >
    <template #default="{ isOpen }">
      <div
        class="flex items-center justify-between box-border"
        :class="[selectedClass]"
      >
        <slot name="selected-option" :option="selectedItem">
          <div>
            <span v-if="selectedItem" class="text-black text-sm">
              {{ selectedItem.display }}
            </span>
            <span v-else class="text-gray-500 text-sm">{{ placeholder }}</span>
          </div>
        </slot>

        <div class="flex items-center gap-2">
          <BaseIcon
            v-if="clearable && selectedItem"
            name="close"
            class="min-w-4 w-4 h-4 text-gray-500 hover:text-white"
            @click.stop="handleClear"
          />

          <BaseIcon
            name="chevron-down"
            class="h-3 w-3 min-w-3 fill-current"
            :class="{
              'ease-in-out duration-300': isOpen,
              'rotate-180': isOpen,
              'rotate-0': !isOpen
            }"
          />
        </div>
      </div>
    </template>

    <template #content="{ close }">
      <slot name="list">
        <div class="p-2 max-h-xs space-y-3" @click.stop>
          <AppInput
            v-if="searchable"
            v-model="search"
            input-classes="focus:border focus:border-solid focus:border-gray-300"
            class="text-black bg-white rounded-lg border border-gray-300"
            sm
            transparent-bg
            :placeholder="$t('common.search')"
          />

          <div>
            <slot name="selected-item" :option="selectedItem" />
            <AppSelectFieldItem
              v-for="item in filteredList"
              :key="`${uuid}-${item}`"
              v-model="value"
              :value="item.value"
              @update:modelValue="close"
            >
              <template #default="{ active }">
                <slot name="option" :option="item" :active="active">
                  <div>
                    <span>
                      {{ item.display }}
                    </span>
                  </div>
                </slot>
              </template>
            </AppSelectFieldItem>
          </div>
          <div v-if="!options.length" class="flex justify-center py-2">
            <AppSpinner sm />
          </div>
          <div
            v-if="!filteredList.length && options.length"
            class="flex justify-center py-2"
          >
            Results not found
          </div>
        </div>
      </slot>
    </template>
  </BaseDropdown>
</template>
