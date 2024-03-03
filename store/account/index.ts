import { defineStore } from 'pinia'
import { Coin } from '@injectivelabs/ts-types'
import { BigNumberInWei, INJ_DENOM } from '@injectivelabs/utils'
import { INJ_GAS_FEE } from '@/app/utils/constants'
import { useChainService } from '~/composables/useChainService'

type AccountStoreState = {
  bankBalances: Coin[]
}

const initialStateFactory = (): AccountStoreState => ({
  bankBalances: []
})

export const useAccountStore = defineStore('account', {
  state: (): AccountStoreState => initialStateFactory(),
  getters: {
    balanceMap: (state: AccountStoreState) => {
      if (state.bankBalances.length === 0) {
        return {}
      }

      return state.bankBalances.reduce((list, balance) => {
        return { ...list, [balance.denom]: balance.amount }
      }, {} as Record<string, string>)
    },

    hasEnoughInjForGas: (state) => {
      const walletStore = useWalletStore()

      const injBalance =
        state.bankBalances.find(({ denom }) => denom === INJ_DENOM)?.amount ||
        '0'

      const hasEnoughInjForGas = new BigNumberInWei(injBalance)
        .toBase()
        .gte(INJ_GAS_FEE)

      return walletStore.isWalletExemptFromGasFee || hasEnoughInjForGas
    }
  },
  actions: {
    async fetchAccountPortfolio() {
      const accountStore = useAccountStore()
      const walletStore = useWalletStore()
      const appStore = useAppStore()

      const { indexerAccountPortfolioApi } = useChainService()

      if (!walletStore.injectiveAddress) {
        return
      }

      const accountPortfolio = await indexerAccountPortfolioApi.fetchAccountPortfolio(
          walletStore.injectiveAddress
        )

      accountStore.$patch({
        bankBalances: accountPortfolio.bankBalancesList || []
      })
    },

    reset() {
      useAccountStore().$reset()
    }
  }
})
