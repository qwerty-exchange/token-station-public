import { defineStore } from 'pinia'
import { Coin } from '@injectivelabs/ts-types'
import { SpotMarket, ExchangeModuleParams } from '@injectivelabs/sdk-ts'
import {
  instantSpotMarketLaunch,
  submitProposalSpotMarketLaunch
} from './message'
import { useChainService } from '~/composables/useChainService'

interface Params {
  makerFeeRate: string
  takerFeeRate: string
  govDeposit: Coin
  spotMarketInstantListingFee: Coin
}

type MarketsStoreState = {
  params: Params | undefined
  markets: SpotMarket[]
}

const initialStateFactory = (): MarketsStoreState => ({
  params: undefined,
  markets: []
})

export const useMarketsStore = defineStore('marktes', {
  state: (): MarketsStoreState => initialStateFactory(),
  getters: {},
  actions: {
    instantSpotMarketLaunch,
    submitProposalSpotMarketLaunch,
    async fetchParams() {
      const marketStore = useMarketsStore()

      const { exchangeApi,  govApi } = useChainService()

      if (marketStore.params) {
        return marketStore.params
      }
      const params = await exchangeApi.fetchModuleParams()

      const govParams = await govApi.fetchModuleParams()

      marketStore.$patch({
        params: {
          makerFeeRate: params.defaultSpotMakerFeeRate,
          takerFeeRate: params.defaultSpotTakerFeeRate,
          govDeposit: govParams.depositParams.minDepositList[0],
          spotMarketInstantListingFee: params.spotMarketInstantListingFee
        }
      })

      return marketStore.params!
    },

    async fetchMarkets(refresh = false) {
      const marketStore = useMarketsStore()
      const { indexerGrpcSpotApi} = useChainService()

      if (marketStore.markets.length > 0 && !refresh) {
        return marketStore.markets
      }

      const markets = await indexerGrpcSpotApi.fetchMarkets()

      marketStore.$patch({
        markets: markets || []
      })

      return markets
    },

    reset() {
      useMarketsStore().$reset()
    }
  }
})
