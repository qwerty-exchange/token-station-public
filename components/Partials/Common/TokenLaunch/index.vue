<script setup lang="ts">
import { BigNumberInWei, Status } from '@injectivelabs/utils'

const walletStore = useWalletStore()
const tokenStore = useTokenStore()
const accountStore = useAccountStore()
const { $onError } = useNuxtApp()

const router = useRouter()
const { values, validate } = useForm()

const status = reactive(new Status())

const injFee = computed(
  // TODO
  () =>
    new BigNumberInWei(
      tokenStore.params.denomCreationFee.find((x) => x.denom === 'inj')
        ?.amount || 0
    )
)

const handleCreateDenom = async () => {
  const { valid } = await validate()

  if (!valid) {
    return
  }

  status.setLoading()
  const denom = `factory/${walletStore.injectiveAddress}/${values.symbol}`
  try {
    await tokenStore.createNewToken(values.symbol, {
      symbol: values.symbol,
      name: values.name,
      description: values.description,
      logo: values.logo,
      decimals: values.decimals
    })
    router.push(`/tokens/${denom}`)
  } catch (error: any) {
    $onError(error)
  } finally {
    status.setIdle()
  }
}

onMounted(() => {
  accountStore.fetchAccountPortfolio()
  tokenStore.fetchParams()
})
</script>

<template>
  <div>
    <AppInput
      id="creator"
      :value="walletStore.injectiveAddress"
      label="Creator Address*"
      :disabled="true"
      input-classes="text-gray-500"
      class="w-full max-w-96 border border-gray-300 py-1 mb-4"
      :transparent-bg="true"
    />
    <PartialsCommonTokenMetadataForm />
    <AppFundValidator :inj-fee="injFee" />
    <div class="flex gap-4 items-center mt-2">
      <AppButton
        :status="status"
        class="bg-gray-750 font-semibold"
        @click="handleCreateDenom"
      >
        Create Token
      </AppButton>
    </div>
  </div>
</template>
