<script lang="ts" setup>
import { useIsFieldDirty } from 'vee-validate'
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

const { value: account, errors: accountErrors } = useStringFieldCustom({
  name: 'To address',
  initialValue: '',
  dynamicRule: computed(() => {
    return 'required|injAddress'
  })
})

const isTouched = useIsFieldDirty('To address')

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

const handleTransfer = async () => {
  status.setLoading()

  const amountChainValue = new BigNumberInBase(amount.value)
    .toWei(tokenDecimals.value)
    .toFixed(0)

  await tokenStore
    .transferToken(account.value, props.denom!, amountChainValue)
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
    <div class="relative mb-4">
      <AppInput
        v-model="account"
        label="To Address*"
        placeholder="inj1..."
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p
        v-if="accountErrors.length > 0 && isTouched"
        class="text-red-500 text-xs mt-1"
      >
        {{ accountErrors[0] }}
      </p>
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
      @click="handleTransfer"
    >
      Transfer Token
    </AppButton>
  </div>
</template>
