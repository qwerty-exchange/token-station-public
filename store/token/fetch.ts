import { fetchAllWithPagination, isCw20ContractAddress } from '@injectivelabs/sdk-ts'
import { getTokenFromDenomsMetadata } from '@injectivelabs/sdk-ui-ts'
import {
  Token,
  TokenType,
  getUnknownTokenWithSymbol
} from '@injectivelabs/token-metadata'
import { useChainService } from '~/composables/useChainService'

export const fetchParams = async () => {
  const tokenStore = useTokenStore()

  const { tokenFactoryApi} = useChainService()

  if (tokenStore.params.denomCreationFee.length > 0) {
    return
  }
  const params = await tokenFactoryApi.fetchModuleParams()
  tokenStore.$patch({
    params
  })
}

export const fetchToken = async (denom: string) => {
  const tokenStore = useTokenStore()
  const walletStore = useWalletStore()

  const { bankApi, tokenFactoryApi } = useChainService()

  if (!walletStore.injectiveAddress) {
    return
  }

  const denomMetadata = await bankApi.fetchDenomMetadata(
    denom
  )
  const supply = await bankApi.fetchSupplyOf(denom)

  const [_, creator, subdemon] = denom.split('/')
  const authorityMetadata =
    await tokenFactoryApi.fetchDenomAuthorityMetadata(
      creator,
      subdemon
    )

  const result = {
    ...getTokenFromDenomsMetadata(denom, denomMetadata || {}),
    display: denomMetadata.display,
    description: denomMetadata.description,
    admin: authorityMetadata.admin,
    suply: supply.amount || '0'
  }

  tokenStore.$patch({
    userTokens:
      [
        ...tokenStore.userTokens.filter((item) => item.denom != result.denom),
        result
      ] || []
  })

  return result
}

export const fetchTokens = async () => {
  const tokenStore = useTokenStore()
  const walletStore = useWalletStore()

  const { bankApi, tokenFactoryApi } = useChainService()

  const { env } = useAppStore()

  if (!walletStore.injectiveAddress) {
    return
  }

  if (tokenStore.chainTokens.length > 0) {
    return
  }

  const modulState = await tokenFactoryApi.fetchModuleState()
  const userTokens = modulState.factoryDenoms.filter(
    (x) =>
      x.denom.includes(walletStore.injectiveAddress) ||
      x.authorityMetadata.admin === walletStore.injectiveAddress
  )


  let { allTokens } = await $fetch(`/api/tokens?env=${env}`)

  const result = await Promise.all(userTokens.map(token => {
    return fetchToken(token!.denom)
  }));

  const chainTokens = allTokens.filter((x) => !userTokens.find(token => x.denom == token.denom))

  tokenStore.$patch({
    userTokens: result,
    chainTokens: [
      ...chainTokens
        .filter((x) => x.symbol != 'UNTRACKED' && x.symbol != 'Unknown')
        .sort((a, b) => a.symbol.localeCompare(b.symbol)),
      ...chainTokens
        .filter((x) => x.symbol == 'UNTRACKED' || x.symbol == 'Unknown')
        .map((x) => ({ ...x, decimals: undefined, symbol: null }))
    ] as Token[]
  })
}
