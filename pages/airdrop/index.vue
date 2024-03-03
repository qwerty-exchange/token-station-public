<script lang="ts" setup>
const walletStore = useWalletStore()
</script>

<template>
  <AppHocLoading
    class="h-full"
    :is-user-connected="walletStore.isUserWalletConnected"
  >
    <div class="container">
      <div class="w-full mx-auto my-4 md:my-12 4xl:w-4/5 relative text-black">
        <CommonPageTitle title="Airdrop" />
        <CommonCard>
          <PartialsCommonAirdropList />
        </CommonCard>
      </div>
    </div>
  </AppHocLoading>
</template>
