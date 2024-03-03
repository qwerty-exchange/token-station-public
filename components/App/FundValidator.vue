<script lang="ts" setup>
import { BigNumberInWei } from '@injectivelabs/utils'

const { setFieldError } = useForm()

const props = defineProps({
  injFee: { type: BigNumberInWei, default: new BigNumberInWei(0) }
})

const accountStore = useAccountStore()

const injAccountBalance = computed(
  () => new BigNumberInWei(accountStore.balanceMap.inj || 0)
)

const injAccountBalanceFormat = computed(() =>
  injAccountBalance.value.toBase(18).toFormat(2, BigNumberInWei.ROUND_DOWN)
)

const injFeeFormat = computed(() => {
  return new BigNumberInWei(props.injFee || 0)
    .toBase(18)
    .toFormat(2, BigNumberInWei.ROUND_DOWN)
})

const hasEnoughBalance = computed(() => {
  return injAccountBalance.value.gte(props.injFee || 0)
})

watch(hasEnoughBalance, (value) => {
  setFieldError('balance', value ? "don't have enough injective tokens" : 'don')
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <p class="font-semibold">
    Cost:
    {{ injFeeFormat }}
    INJ
    <span class="ml-2 text-gray-500 font-normal text-xs">
      (Your balance: {{ injAccountBalanceFormat }} inj
      <BaseIcon
        name="refresh"
        :class="['inline w-4 h-4']"
        @click="() => accountStore.fetchAccountPortfolio()"
      />)
    </span>
  </p>
  <p v-if="!hasEnoughBalance" class="text-red-500 text-xs mb-2">
    You don't have enough INJ tokens to cover the network commission.
  </p>
</template>
