import { defineStore } from 'pinia'
import {
  DEFAULT_GAS_PRICE} from '@injectivelabs/sdk-ui-ts'
import { Locale, english } from '@/locales'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Network, getNetworkChainInfo } from '@injectivelabs/networks'

export const ENV = {
  mainnet: {
    chainId: ChainId.Mainnet,
    ethereumChainId: EthereumChainId.Mainnet,
    network: Network.MainnetSentry
  },
  testnet: {
    chainId: ChainId.Testnet,
    ethereumChainId: EthereumChainId.Goerli,
    network: Network.TestnetSentry
  }
}


type AppStoreState = {
  // App Settings
  locale: Locale
  env: keyof typeof ENV
  chainId: ChainId,
  ethereumChainId: EthereumChainId,
  network: Network,
  gasPrice: string
}

const initialStateFactory = (): AppStoreState => ({
  // App Settings
  locale: english,
  gasPrice: DEFAULT_GAS_PRICE.toString(),
  env: "testnet",
  ...ENV["testnet"]
})


export const useAppStore = defineStore('app', {
  state: (): AppStoreState => initialStateFactory(),
  actions: {
    changeEnv(env: keyof typeof ENV) {
      const appStore = useAppStore()
      appStore.$patch({
        env,
        ...ENV[env]
      })

      useTokenStore().reset()
      useAccountStore().reset()

      const router = useRouter()
      router.replace('/')

      const walletStore = useWalletStore()
      walletStore.init()
      walletStore.validate()
    }
  }
})
