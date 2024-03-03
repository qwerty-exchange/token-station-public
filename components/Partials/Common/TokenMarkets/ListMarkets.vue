<script lang="ts" setup>
import { BigNumberInWei, Status } from '@injectivelabs/utils'

const props = defineProps({
  denom: String,
  baseDenomDecimals: Number
})

const marketsStore = useMarketsStore()

const marketLoadStatus = reactive(new Status())
const markets = computed(() =>
  marketsStore.markets.filter((x) => x.baseDenom === props.denom)
)
const refreshMarketList = async (refresh?: boolean) => {
  marketLoadStatus.setLoading()
  await marketsStore.fetchMarkets(refresh)
  marketLoadStatus.setIdle()
}

const tokenStore = useTokenStore()
const tokens = computed(() => tokenStore.tokens)

onMounted(() => {
  refreshMarketList(false)
})

defineExpose({
  refreshMarketList
})

const getResponsiveNumber = (number: number, decimals: number) => {
  const value = new BigNumberInWei(number).toBase(decimals).toFixed()

  if (value.length > 19) {
    return Number(value).toExponential()
  }

  return value
}
</script>
<template>
  <p class="text-xl mb-4">Markets</p>
  <div class="overflow-auto">
    <AppHocLoading :status="marketLoadStatus">
      <div class="grid grid-cols-12 min-w-[912px] md:min-w-0">
        <span
          class="col-span-2 uppercase text-gray-700 whitespace-nowrap text-2xs"
        >
          Ticker
        </span>
        <span
          class="col-span-4 uppercase text-gray-700 text-end whitespace-nowrap text-2xs"
        >
          Price Tick Size
        </span>
        <span
          class="col-span-4 uppercase text-gray-700 text-end whitespace-nowrap text-2xs"
        >
          Quantity Tick Size
        </span>
        <span
          class="col-span-2 uppercase text-gray-700 whitespace-nowrap text-2xs justify-self-end"
        >
          Status
        </span>
      </div>
      <div
        v-for="market in markets"
        :key="`token-${market.ticker}`"
        class="border-b border-gray-300 last-of-type:border-b-0 block min-w-[912px] md:min-w-0 text-2xs"
      >
        <div class="grid grid-cols-12 items-center py-4 box-content">
          <div class="col-span-2 align-center justify-self-start">
            {{ market.ticker }}
          </div>
          <div class="col-span-4 align-center justify-self-end">
            {{
              getResponsiveNumber(
                market.minPriceTickSize,
                (tokens.find((x: any) => x.denom == market.quoteDenom)!
                  .decimals || 0) - (props.baseDenomDecimals || 0)
              )
            }}
          </div>
          <div class="col-span-4 align-center justify-self-end">
            {{
              getResponsiveNumber(
                market.minQuantityTickSize,
                props.baseDenomDecimals || 0
              )
            }}
          </div>
          <div class="capitalize col-span-2 align-center justify-self-end">
            {{ market.marketStatus }}
          </div>
        </div>
      </div>
      <div v-if="!props.denom" class="text-sm py-4 text-black text-center">
        Choose the base and quote denom to launch a market
      </div>
    </AppHocLoading>
  </div>
</template>
