import {
  MsgInstantSpotMarketLaunch,
  MsgSubmitProposalSpotMarketLaunch
} from '@injectivelabs/sdk-ts'
import { useChainService } from '~/composables/useChainService'

interface MarketParams {
  baseDenom: string
  quoteDenom: string
  minPriceTickSize: string
  minQuantityTickSize: string
  ticker: string
}

export const instantSpotMarketLaunch = async (market: MarketParams) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const msg = MsgInstantSpotMarketLaunch.fromJSON({
    market: {
      ...market,
      sender: walletStore.injectiveAddress
    },
    proposer: walletStore.injectiveAddress
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msg]
  })
}

export const submitProposalSpotMarketLaunch = async (
  title: string,
  description: string,
  makerFeeRate: string,
  takerFeeRate: string,
  market: MarketParams,
  deposit: { amount: string; denom: string }
) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const msg = MsgSubmitProposalSpotMarketLaunch.fromJSON({
    market: {
      title,
      description,
      makerFeeRate,
      takerFeeRate,
      ...market
    },
    proposer: walletStore.injectiveAddress,
    deposit
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msg as any]
  })
}
