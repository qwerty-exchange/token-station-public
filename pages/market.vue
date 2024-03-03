<script lang="ts" setup>
import {
  BigNumberInBase,
  BigNumberInWei,
  Status,
  StatusType
} from '@injectivelabs/utils'
import { useMarketsStore } from '~/store/markets'
import {
  instantSpotMarketLaunch,
  submitProposalSpotMarketLaunch
} from '~/store/markets/message'
import { Modal } from '~/types'

const modalStore = useModalStore()
const tokenStore = useTokenStore()
const walletStore = useWalletStore()
const marketsStore = useMarketsStore()

const { values, resetForm, validate } = useForm()

const { $onError } = useNuxtApp()
const { success, error } = useNotifications()

const status = reactive(new Status())
const tokenFetchStatus = reactive(new Status(StatusType.Loading))

enum LaunchType {
  Instant = 'Instant',
  Gov = 'Gov'
}

const marketListRef = ref()

const marketExists = computedAsync(async () => {
  if (!values.baseDenom || !values.quoteDenom) {
    return undefined
  }

  const markets = await marketsStore.fetchMarkets()

  return !!markets.find(
    (x) =>
      x.baseDenom === values.baseDenom && x.quoteDenom === values.quoteDenom
  )
})

const isModalOpen = computed<boolean>(
  () => modalStore.modals[Modal.Connect] && !walletStore.isUserWalletConnected
)

function handleModalClose() {
  modalStore.closeModal(Modal.GovLaunchRedirection)
}

onMounted(async () => {
  await marketsStore.fetchParams()
  await tokenStore.fetchTokens()
  tokenFetchStatus.setIdle()
})

const handleCreateMarket = async () => {
  const { valid } = await validate()

  if (!valid) {
    return
  }

  if (!marketsStore.params) {
    error({
      title: 'Error'
    })

    return
  }

  status.setLoading()

  try {
    await walletStore.validate()

    const minQuantityTickSize = new BigNumberInBase(values.baseTick)
      .toWei(values.baseDenomDecimals)
      .toFixed()

    const minPriceTickSize = new BigNumberInBase(values.quoteTick)
      .toWei(values.quoteDenomDecimals - values.baseDenomDecimals)
      .toFixed()

    const marketParams = {
      baseDenom: values.baseDenom,
      quoteDenom: values.quoteDenom,
      minPriceTickSize,
      minQuantityTickSize,
      ticker: values.ticker
    }

    const makerFeeRate = new BigNumberInWei(marketsStore.params.makerFeeRate)
      .toBase(16)
      .abs()
      .toFormat(18)
    const takerFeeRate = new BigNumberInWei(marketsStore.params.takerFeeRate)
      .toBase(16)
      .abs()
      .toFormat(18)

    const msg =
      values.launchType === LaunchType.Instant
        ? instantSpotMarketLaunch(marketParams)
        : submitProposalSpotMarketLaunch(
            `Launch ${values.ticker} market`,
            values.proposalContent,
            makerFeeRate,
            takerFeeRate,
            marketParams,
            marketsStore.params.govDeposit
          )

    await msg
      .then(async () => {
        success({
          title: 'Success'
        })
        if (values.launchType === LaunchType.Gov) {
          modalStore.openModal({ type: Modal.GovLaunchRedirection })
        }
        await marketListRef.value.refreshMarketList(true)
        resetForm({
          values: {
            launchType: values.launchType,
            baseDenom: values.baseDenom
          }
        })
      })
      .catch($onError)
      .finally(() => {
        status.setIdle()
      })
  } finally {
    status.setIdle()
  }
}
</script>
<template>
  <AppHocLoading
    class="h-full"
    :status="tokenFetchStatus"
    :is-user-connected="walletStore.isUserWalletConnected"
  >
    <div class="container">
      <div class="w-full mx-auto my-4 md:my-12 4xl:w-4/5 relative text-black">
        <CommonPageTitle title="Launch Market" />
        <CommonCard>
          <div class="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <PartialsCommonMarketLaunch />
              <AppButton
                :status="status"
                class="bg-gray-750 font-semibold mt-2 mb-4"
                @click="handleCreateMarket"
              >
                Launch Market
              </AppButton>
            </div>

            <div>
              <PartialsCommonTokenMarketsListMarkets
                ref="marketListRef"
                :denom="values.baseDenom"
                :base-denom-decimals="values.baseDenomDecimals"
              />
              <p
                v-if="marketExists === false"
                class="text-sm py-4 text-black text-center"
              >
                The {{ values.ticker }} market has not launched on Injective,
                you can launch this market!
              </p>
              <p
                v-else-if="marketExists === true"
                class="text-sm py-4 text-center text-red-500"
              >
                The {{ values.ticker }} market already exists on Injective, you
                cannot launch this market
              </p>
            </div>
          </div>
        </CommonCard>

        <AppModal
          :is-open="isModalOpen"
          class="bg-white"
          :ignore="['.v-popper__popper']"
          md
          @modal:closed="handleModalClose"
        >
          <template #title>
            <h3>Government proposal</h3>
          </template>
          Your Government proposal was created and is available here:
          <a
            target="_blank"
            href="https://hub.injective.network/governance"
            class="font-bold text-blue-550"
            >Injective Hub</a
          >
        </AppModal>
      </div>
    </div>
  </AppHocLoading>
</template>
