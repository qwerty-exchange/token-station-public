<script lang="ts" setup>
import { PropType } from 'vue'
import { Status, StatusType } from '@injectivelabs/utils'
const walletStore = useWalletStore()

defineProps({
  noPadding: Boolean,
  showLoading: Boolean,

  isUserConnected: {
    type: Boolean,
    default: true
  },

  status: {
    type: Object as PropType<Status>,
    default: new Status(StatusType.Idle)
  },

  loaderClass: {
    type: String,
    default: 'relative'
  }
})

async function redirectToLanding() {
  await navigateTo('/')
}

watch(
  () => walletStore.isUserWalletConnected,
  () => {
    if (!walletStore.isUserWalletConnected) {
      redirectToLanding()
    }
  }
)
</script>

<template>
  <div>
    <Suspense>
      <div
        v-if="!isUserConnected"
        class="h-full"
        :class="{
          'py-4': !noPadding
        }"
      >
        <div class="w-full h-full flex justify-center items-center">
          <LayoutWallet />
        </div>
      </div>
      <div
        v-else-if="status.isLoading() || showLoading"
        class="h-full"
        :class="{
          'py-4': !noPadding
        }"
      >
        <AppLoading :class="loaderClass" />
      </div>
      <slot v-else />
      <template #fallback>
        <div class="h-full">
          <AppLoading :class="loaderClass" />
        </div>
      </template>
    </Suspense>
  </div>
</template>
