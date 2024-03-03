<script lang="ts" setup>
import { MsgBurn } from '@injectivelabs/sdk-ts'
import { BigNumberInBase, BigNumberInWei, Status } from '@injectivelabs/utils'
import { useIsFormValid } from 'vee-validate'

const props = defineProps({
  denom: String!
})

const walletStore = useWalletStore()
const tokenStore = useTokenStore()

const accountStore = useAccountStore()

const { $onError } = useNuxtApp()

const { success, error } = useNotifications()

const { resetForm } = useForm()
const isFormValid = useIsFormValid()

const { value: amount, errors: amountErrors } = useStringFieldCustom({
  name: 'amount',
  rule: 'required|positiveNumber'
})

const status = reactive(new Status())

const token = computed(
  () => tokenStore.userTokens.find((x) => x.denom === props.denom)!
)
const tokenDecimals = computed(() => token.value.decimals)

const accountBalance = computed(() => accountStore.balanceMap[props.denom!])
const accountFormated = computed(() =>
  new BigNumberInWei(accountBalance.value || 0)
    .toBase(tokenDecimals.value)
    .toFormat(tokenDecimals.value, BigNumberInWei.ROUND_DOWN)
)

const handleBurn = async () => {
  status.setLoading()

  const amountChainValue = new BigNumberInBase(amount.value)
    .toWei(tokenDecimals.value)
    .toFixed(0)

  await tokenStore
    .burnToken(props.denom!, amountChainValue)
    .then(async () => {
      await accountStore.fetchAccountPortfolio()
      await tokenStore.fetchToken(props.denom!)
      success({
        title: 'Success'
      })
      resetForm()
    })
    .catch($onError)
    .finally(() => {
      status.setIdle()
    })
}
</script>

<template>
  <div>
    <div class="relative">
      <AppInput
        label="Account"
        :value="walletStore.injectiveAddress"
        :disabled="true"
        input-classes="text-gray-500"
        class="w-full max-w-96 border border-gray-300 py-1 mb-4"
        :transparent-bg="true"
      />
    </div>
    <div class="mb-4">
      <div class="flex items-end">
        <AppInputNumeric
          v-model="amount"
          label="Amount*"
          clear-on-paste
          :min="0"
          :max="accountFormated"
          :max-decimals="tokenDecimals"
          input-classes="focus:border focus:border-solid focus:border-gray-300"
          class="w-full max-w-96 border border-gray-300 py-1 mb-4"
          :transparent-bg="true"
          :errors="amountErrors"
        />
      </div>
      <p v-if="amountErrors.length > 0" class="text-red-500 text-xs mt-1">
        {{ amountErrors[0] }}
      </p>
    </div>
    <p class="text-sm mb-1">Account balance: {{ accountFormated }}</p>
    <AppButton
      :status="status"
      :disabled="!isFormValid"
      class="bg-gray-750 font-semibold"
      @click="handleBurn()"
    >
      Burn Token
    </AppButton>
  </div>
</template>
