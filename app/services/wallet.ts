import { Wallet } from '@injectivelabs/wallet-ts'
import {
  ErrorType,
  UnspecifiedErrorCode,
  WalletException
} from '@injectivelabs/exceptions'
import { useChainService } from '~/composables/useChainService'

export const connect = ({
  wallet
}: {
  wallet: Wallet
}) => {
  const { walletStrategy } = useChainService()
  walletStrategy.setWallet(wallet)
}

export const getAddresses = async (): Promise<string[]> => {
  const { walletStrategy } = useChainService()
  const addresses = await walletStrategy.getAddresses()

  if (addresses.length === 0) {
    throw new WalletException(
      new Error('There are no addresses linked in this wallet.'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError
      }
    )
  }

  if (!addresses.every((address) => !!address)) {
    throw new WalletException(
      new Error('There are no addresses linked in this wallet.'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError
      }
    )
  }

  return addresses
}

export const confirm = async (address: string) => {
  const { walletStrategy } = useChainService()
  return await walletStrategy.confirm(address)
}
