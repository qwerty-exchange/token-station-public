import { Network, getNetworkEndpoints } from "@injectivelabs/networks"
import { ChainGrpcBankApi, ChainGrpcTokenFactoryApi, ChainGrpcExchangeApi, ChainGrpcGovApi, IndexerGrpcAccountApi, IndexerGrpcAccountPortfolioApi, IndexerGrpcSpotApi } from "@injectivelabs/sdk-ts"
import { TokenService, DenomClientAsync } from "@injectivelabs/sdk-ui-ts"
import { ChainId } from "@injectivelabs/ts-types";
import { WalletStrategy, Wallet, MsgBroadcaster } from "@injectivelabs/wallet-ts"


export const cache = ref({} as Record<string, Service>);

interface Service {
  walletStrategy: WalletStrategy;
  msgBroadcastClient: MsgBroadcaster;
  tokenService: TokenService;
  demonClient: DenomClientAsync;
  bankApi : ChainGrpcBankApi,
  exchangeApi : ChainGrpcExchangeApi,
  govApi : ChainGrpcGovApi,
  tokenFactoryApi : ChainGrpcTokenFactoryApi,
  indexerAccountApi : IndexerGrpcAccountApi,
  indexerAccountPortfolioApi : IndexerGrpcAccountPortfolioApi,
  indexerGrpcSpotApi: IndexerGrpcSpotApi;

}
export function useChainService() {
  const { chainId, network, ethereumChainId  } = useAppStore()

  if (cache.value[chainId]) {
    return cache.value[chainId]
  }

  const endpoints = getNetworkEndpoints(network)

  const walletStrategy = new WalletStrategy({
    chainId,
    ethereumOptions: {
      ethereumChainId,
      rpcUrl:
      chainId === ChainId.Mainnet ? 'https://eth-mainnet.g.alchemy.com/v2/xvBpvW4QoQbNaWH2FfnAJqOGj7eVTla3' : 'https://eth-goerli.g.alchemy.com/v2/QMAB-ff5mVvVNiThapgsdUgmFUehwnSk'
    },
    disabledWallets: [Wallet.WalletConnect, Wallet.CosmostationEth]
  })


  const bankApi = new ChainGrpcBankApi(endpoints.grpc)

  const tokenFactoryApi = new ChainGrpcTokenFactoryApi(endpoints.grpc)
  const exchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)
  const govApi = new ChainGrpcGovApi(endpoints.grpc)

  const indexerAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)
  const indexerAccountPortfolioApi = new IndexerGrpcAccountPortfolioApi(
    endpoints.indexer
  )

  const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

  // Transaction broadcaster
  const msgBroadcastClient = new MsgBroadcaster({
    walletStrategy,
    network: network,
    networkEndpoints: endpoints,
    simulateTx: true
  })

  const tokenService = new TokenService({
    chainId,
    network
  })
  const demonClient = new DenomClientAsync(network, { alchemyRpcUrl: chainId ===  ChainId.Mainnet ? 'xvBpvW4QoQbNaWH2FfnAJqOGj7eVTla3' : 'MAB-ff5mVvVNiThapgsdUgmFUehwnSk' })


  cache.value[chainId] =  {
    walletStrategy,
    msgBroadcastClient,
    tokenService,
    demonClient,
    bankApi,
    exchangeApi,
    govApi,
    tokenFactoryApi,
    indexerAccountApi,
    indexerAccountPortfolioApi,
    indexerGrpcSpotApi
  }

  return cache.value[chainId]
}
