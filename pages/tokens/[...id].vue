<script lang="ts" setup>
import { Status, StatusType } from '@injectivelabs/utils'

const walletStore = useWalletStore()
const tokenStore = useTokenStore()

const TabList = {
  Mint: 'Mint',
  Burn: 'Burn',
  Trasnfer: 'Transfer',
  Metadata: 'Metadata',
  ChangeOwner: 'Change owner'
}
const activeTab = ref(TabList.Mint)

const route = useRoute()
const id_params = route.params.id as string[]
const id = id_params.length === 3 ? id_params.join('/') : ''

const token = computed(() => tokenStore.userTokens.find((x) => x.denom === id))

const status = reactive(new Status(StatusType.Loading))

onMounted(async () => {
  status.setLoading()
  await tokenStore.fetchToken(id)
  status.setIdle()
})
</script>

<template>
  <AppHocLoading
    class="h-full"
    :status="status"
    :is-user-connected="walletStore.isUserWalletConnected"
  >
    <div class="container">
      <div class="w-full mx-auto my-4 md:my-12 4xl:w-4/5 relative text-black">
        <CommonPageTitle title="Token Details" />
        <CommonCard>
          <PartialsCommonTokenDetails :denom="id" />
          <template v-if="token?.admin === walletStore.injectiveAddress">
            <CommonTabMenu class="mb-8">
              <AppSelectButton
                v-for="tab in Object.values(TabList)"
                v-model="activeTab"
                :value="tab"
              >
                <template #default="{ active }">
                  <CommonTabMenuItem :active="active">
                    <span>{{ tab }}</span>
                  </CommonTabMenuItem>
                </template>
              </AppSelectButton>
            </CommonTabMenu>
            <div class="block md:grid md:grid-cols-2 gap-8 md:gap-16">
              <PartialsCommonTokenMint
                v-if="activeTab === TabList.Mint"
                :denom="id"
              />
              <PartialsCommonTokenBurn
                v-if="activeTab === TabList.Burn"
                :denom="id"
              />
              <PartialsCommonTokenTransfer
                v-if="activeTab === TabList.Trasnfer"
                :denom="id"
              />
              <PartialsCommonTokenChangeOwner
                v-if="activeTab === TabList.ChangeOwner"
                :denom="id"
              />
              <PartialsCommonTokenMetadata
                v-if="activeTab === TabList.Metadata"
                :denom="id"
              />
            </div>
          </template>
        </CommonCard>
      </div>
    </div>
  </AppHocLoading>
</template>
