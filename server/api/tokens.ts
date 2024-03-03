import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { ChainGrpcBankApi, ChainGrpcTokenFactoryApi } from "@injectivelabs/sdk-ts";
import { DenomClientAsync } from "@injectivelabs/sdk-ui-ts";
import { Token, TokenType, getUnknownTokenWithSymbol } from "@injectivelabs/token-metadata";
import { ChainId } from "@injectivelabs/ts-types";
import { prisma } from "~/server/prisma";
import kv from '@vercel/kv';


export default cachedEventHandler(async (event) => {

  const { env } = getQuery(event)

  if (env == null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request: param env',
    });
  }

  const network = env == "mainnet" ? Network.MainnetSentry : Network.TestnetSentry

  const endpoints = getNetworkEndpoints(network)

  const demonClient = new DenomClientAsync(network, { alchemyRpcUrl: env == "mainnet" ? 'xvBpvW4QoQbNaWH2FfnAJqOGj7eVTla3' : 'MAB-ff5mVvVNiThapgsdUgmFUehwnSk' })


  const bankApi = new ChainGrpcBankApi(endpoints.grpc)
  const tokenFactoryApi = new ChainGrpcTokenFactoryApi(endpoints.grpc)


  const tokensChain = await bankApi.fetchAllTotalSupply()


  const modulState = await tokenFactoryApi.fetchModuleState()
  const denoms = modulState.factoryDenoms;


  tokensChain.supply = [
    ...denoms.filter((x) => !tokensChain.supply.some((y) => y.denom == x.denom)).map((x) => ({ denom: x.denom, amount: '0' })),
    ...tokensChain.supply,
  ]

  await demonClient.preloadMetadata()

  const allTokensAsync =
    tokensChain.supply
      .filter((x) => !x.denom.startsWith('share'))
      .map((x) => (async () => {
        try {
          const token = await demonClient.getDenomToken(x.denom)
          if (token == null) {
            return getUnknownTokenWithSymbol(x.denom)
          }

          if (token.ibc && !token.symbol) {
            return {
              ...getUnknownTokenWithSymbol(x.denom),
              tokenType: TokenType.Ibc
            }
          }

          return token
        } catch (e: any) {
          return getUnknownTokenWithSymbol(x.denom)
        }
      })())

  const allTokens = await Promise.all(allTokensAsync);

  return {
    allTokens
  }
}, {
  maxAge: 300,
  staleMaxAge: -1
})
