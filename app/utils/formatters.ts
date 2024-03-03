import { BigNumber, BigNumberInBase } from '@injectivelabs/utils'

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
  }
})

export const formatWalletAddress = (address: string): string => {
  if (address.length <= 10) {
    return address
  }

  return `${address.slice(0, 6)}...${address.slice(
    address.length - 6,
    address.length
  )}`
}

export function formatAmount(
  amount: BigNumberInBase,
  displayDecimals: number
): string {
  return amount.toFormat(displayDecimals || 1, BigNumber.ROUND_DOWN)
}
