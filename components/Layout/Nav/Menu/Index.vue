<script lang="ts" setup>
const appStore = useAppStore()
const links = computed(() => ({
  hub:
    appStore.env === 'mainnet'
      ? 'https://hub.injective.network/bridge'
      : 'https://testnet.hub.injective.network/bridge',
  explorer:
    appStore.env === 'mainnet'
      ? 'https://explorer.injective.network/'
      : 'https://testnet.explorer.injective.network/',
  faucet:
    appStore.env === 'mainnet'
      ? 'https://inj.supply/'
      : 'https://testnet.faucet.injective.network/',
  helix:
    appStore.env === 'mainnet'
      ? 'https://helixapp.com/'
      : 'https://testnet.helixapp.com/'
}))
</script>

<template>
  <div>
    <nav class="block flex-1 lg:flex">
      <LayoutNavMenuItem :to="links.hub" target="_blank" class="block">
        Bridge
      </LayoutNavMenuItem>
      <LayoutNavMenuItem :to="links.explorer" target="_blank" class="block">
        Explorer
      </LayoutNavMenuItem>
      <LayoutNavMenuItem :to="links.helix" target="_blank" class="block">
        Helix
      </LayoutNavMenuItem>
      <LayoutNavMenuItem :to="links.faucet" target="_blank" class="block">
        Faucet
      </LayoutNavMenuItem>
    </nav>
  </div>
</template>
