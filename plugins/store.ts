import {
  PiniaPluginContext,
  StateTree,
  SubscriptionCallback,
  SubscriptionCallbackMutationPatchObject
} from 'pinia'
import { Wallet } from '@injectivelabs/wallet-ts'
import { defineNuxtPlugin } from '#imports'
import { localStorage } from '@/app/Services'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { ENV } from '~/store/app'

const stateToPersist = {
  app: {
    env: "testnet",
    ...ENV["testnet"]
  },

  account: {
    subaccountId: ''
  },

  wallet: {
    wallet: Wallet.Metamask,
    address: '',
    addresses: '',
    injectiveAddress: '',
    defaultSubaccountId: '',
    addressConfirmation: ''
  }
} as Record<string, Record<string, any>>


const persistState = (
  mutation: SubscriptionCallbackMutationPatchObject<StateTree>,
  state: StateTree
) => {
  if (!stateToPersist[mutation.storeId]) {
    return
  }

  const keysToPersist = Object.keys(stateToPersist[mutation.storeId])

  if (!mutation.payload) {
    return
  }

  const shouldPersistState =
    keysToPersist.length > 0 &&
    Object.keys(mutation.payload || []).some((key) => {
      return keysToPersist.includes(key)
    })

  if (!shouldPersistState) {
    return
  }

  const updatedState = keysToPersist.reduce((stateObj, key) => {
    return {
      ...stateObj,
      [key]: mutation.payload[key] || state[key]
    }
  }, {})

  const existingState = (localStorage.get('state-new') || {}) as any

  localStorage.set('state-new', {
    ...stateToPersist,
    ...existingState,
    [mutation.storeId]: {
      ...updatedState
    }
  })
}

function piniaStoreSubscriber({ store }: PiniaPluginContext) {
  const localState = localStorage.get('state-new') as any

  if (localState[store.$id]) {
    store.$state = { ...store.$state, ...localState[store.$id] }
  }

  store.$subscribe(persistState as SubscriptionCallback<StateTree>)
}

export default defineNuxtPlugin(
  ({
    vueApp: {
      config: { globalProperties }
    }
  }) => {
    globalProperties.$pinia.use(piniaStoreSubscriber)
  }
)
