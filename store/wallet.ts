import { defineStore } from 'pinia'
import { isCosmosWallet, Wallet } from '@injectivelabs/wallet-ts'
import {
  getDefaultSubaccountId,
  getEthereumAddress,
  getInjectiveAddress
} from '@injectivelabs/sdk-ts'
import {
  ErrorType,
  UnspecifiedErrorCode,
  ChainCosmosErrorCode,
  CosmosWalletException
} from '@injectivelabs/exceptions'
import { CosmosChainId } from '@injectivelabs/ts-types'
import { confirm, connect, getAddresses } from '@/app/services/wallet'
import { validateMetamask, isMetamaskInstalled } from '@/app/services/metamask'
import {
  validateCosmosWallet,
  confirmCorrectKeplrAddress
} from '@/app/services/cosmos'
import { BusEvents, WalletConnectStatus } from '@/types'
import { useChainService } from '~/composables/useChainService'

type WalletStoreState = {
  walletConnectStatus: WalletConnectStatus
  address: string
  injectiveAddress: string
  addressConfirmation: string
  addresses: string[]
  metamaskInstalled: boolean
  wallet: Wallet
}

const initialStateFactory = (): WalletStoreState => ({
  address: '',
  addresses: [],
  injectiveAddress: '',
  addressConfirmation: '',
  wallet: Wallet.Metamask,
  metamaskInstalled: false,
  walletConnectStatus: WalletConnectStatus.idle
})

export const useWalletStore = defineStore('wallet', {
  state: (): WalletStoreState => initialStateFactory(),
  getters: {
    isUserWalletConnected: (state) => {
      const addressConnectedAndConfirmed =
        !!state.address && !!state.addressConfirmation
      const hasAddresses = state.addresses.length > 0

      return (
        hasAddresses && addressConnectedAndConfirmed && !!state.injectiveAddress
      )
    },

    defaultSubaccountId: (state) => {
      if (!state.injectiveAddress) {
        return ''
      }

      return getDefaultSubaccountId(state.injectiveAddress)
    },

    isCosmosWallet: (state) => {
      return isCosmosWallet(state.wallet)
    },

    /**
     * Fee delegation doesn't
     * work for cosmos wallets and its disabled
     * on devnet
     */
    isWalletExemptFromGasFee: (state) => {
      return !isCosmosWallet(state.wallet)
    }
  },
  actions: {
    async init() {
      const walletStore = useWalletStore()

      if (!walletStore.wallet) {
        return
      }

      await connect({ wallet: walletStore.wallet })

      const accountStore = useAccountStore()
      await accountStore.fetchAccountPortfolio()
    },

    async connectWallet(wallet: Wallet) {
      const walletStore = useWalletStore()

      walletStore.$patch({
        wallet,
        walletConnectStatus: WalletConnectStatus.connecting
      })

      await connect({ wallet })
    },

    async onConnect() {
      const accountStore = useAccountStore()
      const walletStore = useWalletStore()

      useEventBus(BusEvents.WalletConnected).emit()

      await accountStore.fetchAccountPortfolio()

      walletStore.$patch({
        walletConnectStatus: WalletConnectStatus.connected
      })
    },

    async isMetamaskInstalled() {
      const walletStore = useWalletStore()

      walletStore.$patch({
        metamaskInstalled: await isMetamaskInstalled()
      })
    },

    async getHWAddresses(wallet: Wallet) {
      const walletStore = useWalletStore()

      if (walletStore.addresses.length === 0 || walletStore.wallet !== wallet) {
        await connect({ wallet })

        walletStore.$patch({
          wallet,
          addresses: await getAddresses()
        })
      } else {
        const addresses = await getAddresses()

        walletStore.$patch({
          wallet,
          addresses: [...walletStore.addresses, ...addresses]
        })
      }
    },

    async connectLedger(address: string) {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(walletStore.wallet)

      const addresses = [address]
      const addressConfirmation = await confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation
      })

      await walletStore.onConnect()
    },

    async connectTrezor(address: string) {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(walletStore.wallet)

      const addresses = [address]
      const addressConfirmation = await confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation
      })

      await walletStore.onConnect()
    },

    async connectMetamask() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Metamask)

      const addresses = await getAddresses()
      const [address] = addresses
      const addressConfirmation = await confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation
      })

      await walletStore.onConnect()
    },

    async connectWalletConnect() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.WalletConnect)

      const addresses = await getAddresses()
      const [address] = addresses
      const addressConfirmation = await confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation
      })

      await walletStore.onConnect()
    },

    async connectKeplr() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Keplr)

      const injectiveAddresses = await getAddresses()
      const [injectiveAddress] = injectiveAddresses
      const addressConfirmation = await confirm(injectiveAddress)
      const ethereumAddress = getEthereumAddress(injectiveAddress)

      await confirmCorrectKeplrAddress(injectiveAddress)

      walletStore.$patch({
        injectiveAddress,
        addressConfirmation,
        address: ethereumAddress,
        addresses: injectiveAddresses
      })

      await walletStore.onConnect()
    },

    async connectLeap() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Leap)

      const injectiveAddresses = await getAddresses()
      const [injectiveAddress] = injectiveAddresses
      const addressConfirmation = await confirm(injectiveAddress)
      const ethereumAddress = getEthereumAddress(injectiveAddress)

      walletStore.$patch({
        injectiveAddress,
        addressConfirmation,
        address: ethereumAddress,
        addresses: injectiveAddresses
      })

      await walletStore.onConnect()
    },

    async connectCosmostation() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Cosmostation)

      const injectiveAddresses = await getAddresses()
      const [injectiveAddress] = injectiveAddresses
      const addressConfirmation = await confirm(injectiveAddress)
      const ethereumAddress = getEthereumAddress(injectiveAddress)

      walletStore.$patch({
        injectiveAddress,
        addressConfirmation,
        address: ethereumAddress,
        addresses: injectiveAddresses
      })

      await walletStore.onConnect()
    },

    async connectTorus() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Torus)

      const addresses = await getAddresses()
      const [address] = addresses
      const addressConfirmation = await confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation
      })

      await walletStore.onConnect()
    },

    async connectAddress(injectiveAddress: string) {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Metamask)

      const addressConfirmation = await confirm(injectiveAddress)
      const address = getEthereumAddress(injectiveAddress)

      walletStore.$patch({
        address,
        addresses: [address],
        injectiveAddress,
        addressConfirmation
      })

      await walletStore.onConnect()
    },

    setWalletConnectStatus(walletConnectStatus: WalletConnectStatus) {
      const walletStore = useWalletStore()

      walletStore.$patch({
        walletConnectStatus
      })
    },

    setAddresses(addresses: string[]) {
      const walletStore = useWalletStore()

      walletStore.$patch({
        addresses
      })
    },

    async validate() {
      const { hasEnoughInjForGas } = useAccountStore()
      const { ethereumChainId, chainId } = useAppStore()
      const { wallet, injectiveAddress, address } = useWalletStore()

      if (wallet === Wallet.Metamask) {
        await validateMetamask(address, ethereumChainId)
      }

      if (isCosmosWallet(wallet)) {
        await validateCosmosWallet({
          address: injectiveAddress,
          chainId: chainId as unknown as CosmosChainId,
          wallet
        })

        if (!hasEnoughInjForGas) {
          throw new CosmosWalletException(
            new Error('Insufficient INJ to pay for gas/transaction fees.'),
            {
              code: UnspecifiedErrorCode,
              type: ErrorType.WalletError,
              contextCode: ChainCosmosErrorCode.ErrInsufficientFee
            }
          )
        }
      }
    },

    async logout() {
      const accountStore = useAccountStore()
      const walletStore = useWalletStore()
      const { walletStrategy } = useChainService()
      const tokenStore = useTokenStore()

      await walletStrategy.disconnect()

      walletStore.reset()

      accountStore.$reset()

      tokenStore.reset()
    },

    reset() {
      const walletStore = useWalletStore()

      const { address, addresses, injectiveAddress, addressConfirmation } =
        initialStateFactory()

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation
      })
    }
  }
})
