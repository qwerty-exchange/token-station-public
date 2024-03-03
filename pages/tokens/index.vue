<script lang="ts" setup>
import { Status } from '@injectivelabs/utils'

const walletStore = useWalletStore()
const tokenStore = useTokenStore()

const status = reactive(new Status())

onMounted(() => {
  status.setLoading()
  tokenStore.fetchTokens().then(() => status.setIdle())
})
</script>

<template>
  <AppHocLoading
    class="h-full"
    :status="status"
    :is-user-connected="walletStore.isUserWalletConnected"
  >
    <div class="container max-w-[100vw] xl:max-w-screen-4xl">
      <div class="w-full 4xl:w-4/5 my-4 md:my-12 mx-auto self-center">
        <CommonPageTitle title="Manage Token" />
        <CommonCard>
          <div class="overflow-auto">
            <PartialsCommonMarketsHeader class="pb-2" />
            <PartialsCommonMarketsRow
              v-for="token in tokenStore.userTokens"
              :key="`token-${token.denom}`"
              :token="token"
              class="text-black"
            />
            <div v-if="!tokenStore.userTokens.length" class="py-4 text-black">
              Don't have your own token yet?
              <NuxtLink to="/launch" class="font-bold text-blue-550">
                Create Token
              </NuxtLink>
            </div>
          </div>
        </CommonCard>
      </div>
    </div>
  </AppHocLoading>
</template>
