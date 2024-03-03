import {
  MsgBurn,
  MsgChangeAdmin,
  MsgCreateDenom,
  MsgMint,
  MsgSend,
  MsgMultiSend,
  MsgSetDenomMetadata,
  Coin
} from '@injectivelabs/sdk-ts'
import { BigNumber } from '@injectivelabs/utils'
import { useChainService } from '~/composables/useChainService'

export const createNewToken = async (
  symbol: string,
  metadata: {
    symbol: string
    name: string
    description: string
    logo: string
    decimals: number
  }
) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const denom = `factory/${walletStore.injectiveAddress}/${symbol}`
  const msgCreateDenom = MsgCreateDenom.fromJSON({
    sender: walletStore.injectiveAddress,
    subdenom: symbol
  })

  const msgMetadata = MsgSetDenomMetadata.fromJSON({
    sender: walletStore.injectiveAddress,
    metadata: {
      base: denom,
      symbol: metadata.symbol,
      name: metadata.name,
      denomUnits: [
        {
          denom,
          exponent: 0,
          aliases:
            metadata.decimals > 0
              ? ['u' + metadata.symbol.toLocaleLowerCase()]
              : [metadata.symbol.toLocaleLowerCase()]
        },
        ...[
          ...(metadata.decimals > 0
            ? [
                {
                  denom: metadata.symbol,
                  exponent: Number(metadata.decimals),
                  aliases: []
                }
              ]
            : ([] as any))
        ]
      ],
      description: metadata.description,
      display: metadata.decimals > 0 ? metadata.symbol : denom,
      uri: metadata.logo,
      uriHash: ''
    }
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msgCreateDenom, msgMetadata]
  })
}

export const updateTokenMetadata = async (
  denom: string,
  metadata: {
    symbol: string
    name: string
    description: string
    logo: string
    decimals: number
  }
) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const msg = MsgSetDenomMetadata.fromJSON({
    sender: walletStore.injectiveAddress,
    metadata: {
      base: denom,
      symbol: metadata.symbol,
      name: metadata.name,
      denomUnits: [
        {
          denom,
          exponent: 0,
          aliases:
            metadata.decimals > 0
              ? ['u' + metadata.symbol.toLocaleLowerCase()]
              : [metadata.symbol.toLocaleLowerCase()]
        },
        ...[
          ...(metadata.decimals > 0
            ? [
                {
                  denom: metadata.symbol,
                  exponent: Number(metadata.decimals),
                  aliases: []
                }
              ]
            : ([] as any))
        ]
      ],
      description: metadata.description,
      display: metadata.decimals > 0 ? metadata.symbol : denom,
      uri: metadata.logo,
      uriHash: ''
    }
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msg]
  })
}

export const mintToken = async (denom: string, amount: string) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const msg = MsgMint.fromJSON({
    sender: walletStore.injectiveAddress,

    amount: {
      denom,
      amount
    }
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msg]
  })
}

export const burnToken = async (denom: string, amount: string) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const msg = MsgBurn.fromJSON({
    sender: walletStore.injectiveAddress,

    amount: {
      denom,
      amount
    }
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msg]
  })
}

export const transferToken = async (
  to: string,
  denom: string,
  amount: string
) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const msg = MsgSend.fromJSON({
    srcInjectiveAddress: walletStore.injectiveAddress,
    dstInjectiveAddress: to,
    amount: {
      denom,
      amount
    }
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msg]
  })
}

export const transferMultiToken = async (
  to: { address: string; amount: string; denom: string }[]
) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  var result = [] as Coin[]
  to.reduce((res: any, value: any) => {
    if (!res[value.denom]) {
      res[value.denom] = { amount: new BigNumber(0), denom: value.denom }
      result.push(res[value.denom])
    }
    res[value.denom].amount = new BigNumber(value.amount.trim()).plus(
      res[value.denom].amount
    )
    return res
  }, {})
  const msg = MsgMultiSend.fromJSON({
    inputs: [
      {
        address: walletStore.injectiveAddress,
        coins: result.map((x) => ({ ...x, amount: x.amount.toString() }))
      }
    ],
    outputs: to
      .map((x) => ({
        address: x.address,
        coins: [{ amount: x.amount.toString(), denom: x.denom }]
      }))
  })

  return await msgBroadcastClient.broadcast({
    gas: {
      // gas: 22500 * to.length
      gas: 50_000_000
    },
    address: walletStore.injectiveAddress,
    msgs: [msg]
  })
}

export const changeTokenAdmin = async (denom: string, newAdmin: string) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  const msg = MsgChangeAdmin.fromJSON({
    sender: walletStore.injectiveAddress,
    denom,
    newAdmin: newAdmin
  })

  await msgBroadcastClient.broadcastWithFeeDelegation({
    address: walletStore.injectiveAddress,
    msgs: [msg]
  })
}
