<script lang="ts" setup>
import { BusEvents } from '@/types'

async function redirectToDashboard() {
  await navigateTo('/launch')
}

useEventBus(BusEvents.WalletConnected).on(redirectToDashboard)
</script>

<template>
  <div class="container py-4 sm:py-10 xl:px-10 relative">
    <div class="w-full mx-auto">
      <PartialsHomeHero />
      <PartialsHomeFeatures />
      <PartialsHomeFlow />
    </div>
  </div>
</template>
