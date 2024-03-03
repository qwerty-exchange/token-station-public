import { BigNumber, BigNumberInBase } from '@injectivelabs/utils'

export const getDecimalsBasedOnNumber = (
  number: number | string | BigNumber,
  defaultDecimals = 4
): { number: BigNumberInBase; decimals: number } => {
  const actualNumber = new BigNumber(number)

  if (actualNumber.gte(1e6)) {
    return {
      number: new BigNumberInBase(actualNumber.toFixed(0)),
      decimals: 0
    }
  }

  if (actualNumber.gte(1e4)) {
    return {
      number: new BigNumberInBase(actualNumber.toFixed(1)),
      decimals: 1
    }
  }

  return {
    number: new BigNumberInBase(actualNumber.toFixed(defaultDecimals)),
    decimals: defaultDecimals
  }
}

export const getImageSrc = (src: string) => {
  if (src.startsWith('ipfs://')) {
    return `https://${src.replace('ipfs://', '')}.ipfs.nftstorage.link/`
  }
  return src
}
