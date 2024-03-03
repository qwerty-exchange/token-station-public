import { defineNuxtPlugin } from '#app'
import { email, min, max, between, url } from '@vee-validate/rules'
import { getEthereumAddress } from '@injectivelabs/sdk-ts'
import { NUMBER_REGEX } from '@injectivelabs/sdk-ui-ts'
import { defineRule } from 'vee-validate'
import { BigNumberInBase } from '@injectivelabs/utils'

const formatFieldName = (value: string) => value.replace(/[^a-z]+/gi, '')

export const errorMessages = {
  injAddress: () => 'This field is not a valid Injective address',
  positiveNumber: () => 'This field is not a valid number',
  integer: (fieldName: string) => `${fieldName} must be > 0`,
  between: (_field: string, params: Record<string, any>) =>
    `${
      params.max <= params.min
        ? `Your input value of ${params._value_} cant be higher than ${params.max}`
        : `This field should be between ${params.min} and ${params.max}`
    }`,
  tick: () => 'Invalid tick size value'
} as Record<string, (field?: string, params?: Record<string, any>) => string>

export const defineGlobalRules = () => {
  defineRule('email', email)
  defineRule('between', between)
  defineRule('min', min)
  defineRule('max', max)
  defineRule('url', url)

  defineRule(
    'required',
    (value: string | number, _, { field }: { field: string }) => {
      if (value === undefined || !value.toString().length) {
        return `This field is required.`
      }

      return true
    }
  )

  defineRule('injAddress', (value: string) => {
    try {
      getEthereumAddress(value)

      return true
    } catch (error: any) {
      return errorMessages.injAddress()
    }
  })

  defineRule('positiveNumber', (value: string) => {
    if (NUMBER_REGEX.test(value)) {
      return true
    }

    return errorMessages.positiveNumber()
  })

  defineRule('positiveNumber', (value: string) => {
    if (NUMBER_REGEX.test(value)) {
      return true
    }

    return errorMessages.positiveNumber()
  })

  defineRule('integer', (value: string, [fieldName]: string[]) => {
    const valueInBigNumber = new BigNumberInBase(value || 0)

    if (valueInBigNumber.lte(0)) {
      return errorMessages.integer(fieldName)
    }

    return true
  })

  defineRule('tick', (value: string, [decimals]: number[]) => {
    const regex = new RegExp(
      decimals == 0 ? `(^1(0*)$)` : `(^0.(0{0,${decimals}})1$)|(^1(0*)$)`
    )
    return regex.test(value) || errorMessages.tick()
  })
}

export default defineNuxtPlugin(() => {
  defineGlobalRules()
})
