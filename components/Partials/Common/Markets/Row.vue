<script lang="ts" setup>
import { getImageSrc } from '~/app/utils/helpers'

const props = defineProps({
  token: Object as PropType<any>
})

const url = getImageSrc(props?.token?.logo)
</script>

<template>
  <div
    class="border-b border-gray-300 last-of-type:border-b-0 block min-w-[912px] md:min-w-0"
  >
    <div class="grid grid-cols-12 items-center py-4 box-content">
      <div class="col-span-6 flex items-center justify-start">
        <div class="flex items-center justify-start gap-2">
          <div class="flex items-center justify-start">
            <div class="w-4 h-4 md:w-6 md:h-6 mr-3 overflow-hidden">
              <AppTokenLogo :src="url" />
            </div>
            <div class="text-left text-gray-700 text-sm whitespace-nowrap">
              <div class="flex gap-2 leading-4 font-bold">
                {{ token?.name }}
              </div>
              <p class="text-gray-500 text-xs leading-3.5">
                {{ token?.denom }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-2 align-center justify-self-end">
        {{ token?.symbol }}
      </div>
      <div class="col-span-2 align-center justify-self-end"></div>
      <div class="col-span-2 align-center justify-self-end">
        <NuxtLink :to="`/tokens/${token?.denom}`">
          <AppButton class="bg-gray-750 font-semibold"> Details </AppButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
