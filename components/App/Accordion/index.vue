<script lang="ts" setup>
defineProps({
  sm: Boolean,
  isOpen: Boolean
})

const emit = defineEmits<{
  'panel:toggle': []
}>()

function handleToggle() {
  emit('panel:toggle')
}
</script>

<template>
  <div>
    <dt class="text-xs">
      <button
        class="text-left w-full flex items-start text-gray-700"
        :class="{
          'items-center': sm
        }"
        :aria-expanded="isOpen"
        @click.stop="handleToggle"
      >
        <div class="text-gray-700 flex items-start">
          <slot name="title" />
          <slot name="badge" />
        </div>
        <span class="ml-2 h-6 flex items-center">
          <svg
            class="transform h-3 w-3"
            :class="{
              'rotate-180': isOpen
            }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
    </dt>
    <dd
      v-show="isOpen"
      class="mt-2"
      :class="{
        'pr-12': !sm
      }"
    >
      <slot name="content" />
    </dd>
  </div>
</template>
