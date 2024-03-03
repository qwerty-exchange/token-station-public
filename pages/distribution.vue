<script lang="ts" setup>
const walletStore = useWalletStore()
const tokenStore = useTokenStore()
onMounted(() => {
  tokenStore.fetchTokens()
})
</script>

<template>
  <AppHocLoading
    class="h-full"
    :show-loading="tokenStore.tokens.length == 0"
    :is-user-connected="walletStore.isUserWalletConnected"
  >
    <div class="container">
      <div class="w-full mx-auto my-4 md:my-12 4xl:w-4/5 relative text-black">
        <CommonPageTitle title="Airdrop Token" />
        <CommonCard>
          <!-- <div class="grid md:grid-cols-2 gap-8 md:gap-16"> -->
          <PartialsCommonTokenMultipleTransfer />
          <!-- <div class="text-gray-600 max-w-2xl"> -->
          <!-- <div>
                <p class="font-bold">
                  Here's a simple solution to airdrop events
                </p>
                <ul class="list-disc list-inside mb-4">
                  <li>Chose a token that you want to distribute.</li>
                  <li>
                    Upload .csv file with addresses and amounts in format:
                    <code class="text-xs">
                      inj1x59f3klrj20uenzynq5va2r9jjn0g4req1wpc0, 50000<br />
                      inj1x59f3klrj20uenzynq5va3r9jjn0g4req7wpc0, 50000
                    </code>
                  </li>
                  <li>Values should not include decimals</li>
                  <li>Start distributing!</li>
                </ul>
              </div> -->
          <!-- </div> -->
          <!-- </div> -->
        </CommonCard>
      </div>
    </div>
  </AppHocLoading>
</template>
