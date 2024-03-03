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
        <CommonPageTitle title="Create Token" />
        <CommonCard>
          <div class="grid md:grid-cols-2 gap-8 md:gap-16">
            <PartialsCommonTokenLaunch />
            <div class="text-gray-600 max-w-2xl">
              <div>
                <p class="font-bold">
                  Here's a simple, fast, and convenient token generator
                </p>
                <ul class="list-disc list-inside mb-4">
                  <li>No smart contract programming required.</li>
                  <li>Gain 100% ownership of the generated tokens.</li>
                  <li>Set custom token name, symbol and initial supply.</li>
                  <li>Sign and create a token from your own wallet.</li>
                </ul>
              </div>
            </div>
          </div>
        </CommonCard>
      </div>
    </div>
  </AppHocLoading>
</template>
