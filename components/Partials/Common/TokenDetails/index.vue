<script lang="ts" setup>
import { getImageSrc } from '~/app/utils/helpers'

const tokenStore = useTokenStore()

const props = defineProps({
  denom: String!
})

const token = computed(
  () => tokenStore.userTokens.find((x) => x.denom === props.denom)!
)
const tokenDecimals = computed(() => token.value?.decimals)

const imgSrcPreview = computed(() => getImageSrc(token.value?.logo || ''))
</script>

<template>
  <div class="flex items-center content-center mb-4">
    <AppTokenLogo class="w-12 h-12" :src="`${imgSrcPreview}`" />
    <p class="text-2xl ml-4">{{ token.name }}</p>
  </div>
  <div
    class="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg border border-gray-300 mb-8"
  >
    <div>
      <p class="text-xs font-semibold">Denom:</p>
      <p class="text-sm text-gray-600 mb-2 break-words">
        {{ token.denom }}
      </p>
    </div>
    <div>
      <p class="text-xs font-semibold">Supply:</p>
      <p class="text-sm text-gray-600 mb-2">{{ token.suply }}</p>
    </div>
    <div>
      <p class="text-xs font-semibold">Symbol:</p>
      <p class="text-sm text-gray-600 mb-2">{{ token.symbol }}</p>
    </div>
    <div>
      <p class="text-xs font-semibold">Name:</p>
      <p class="text-sm text-gray-600">{{ token.name }}</p>
    </div>
    <div>
      <p class="text-xs font-semibold">Display:</p>
      <p class="text-sm text-gray-600 mb-2">
        {{ token.display }}
      </p>
    </div>
    <div>
      <p class="text-xs font-semibold">Decimals:</p>
      <p class="text-sm text-gray-600">{{ tokenDecimals }}</p>
    </div>
    <div>
      <p class="text-xs font-semibold">Description:</p>
      <p class="text-sm text-gray-600 mb-2">{{ token.description }}</p>
    </div>
    <div>
      <p class="text-xs font-semibold">Logo URL:</p>
      <p class="text-sm text-gray-600 mb-2">
        <a target="_blank" class="text-blue-500" :href="imgSrcPreview">{{
          token.logo
        }}</a>
      </p>
    </div>
    <div>
      <p class="text-xs font-semibold">Admin:</p>
      <p class="text-sm text-gray-600 mb-2">
        {{ token.admin }}
      </p>
    </div>
  </div>
</template>
