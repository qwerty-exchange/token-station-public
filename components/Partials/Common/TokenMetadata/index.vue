<script lang="ts" setup>
import { Status } from '@injectivelabs/utils'
import { useIsFormValid } from 'vee-validate'

const props = defineProps({
  denom: String!
})

const tokenStore = useTokenStore()

const { $onError } = useNuxtApp()

const { success } = useNotifications()

const { values, setValues } = useForm()
const isFormValid = useIsFormValid()

const token = computed(
  () => tokenStore.userTokens.find((x) => x.denom === props.denom)!
)

onMounted(() => {
  if (token.value) {
    setValues({
      ...token.value
    })
  }
})

watch(token, (value) => {
  if (value) {
    setValues({
      ...value
    })
  }
})

const status = reactive(new Status())

const handleSetDenomMetadata = async () => {
  status.setLoading()

  await tokenStore
    .updateTokenMetadata(props.denom!, {
      symbol: values.symbol,
      name: values.name,
      description: values.description,
      logo: values.logo,
      decimals: values.decimals
    })
    .then(async () => {
      success({
        title: 'Success'
      })
      await tokenStore.fetchToken(props.denom!)
    })
    .catch($onError)
    .finally(() => {
      status.setIdle()
    })
}
</script>

<template>
  <div>
    <PartialsCommonTokenMetadataForm />
    <AppButton
      :disabled="!isFormValid"
      :status="status"
      class="bg-gray-750 font-semibold"
      @click="handleSetDenomMetadata"
    >
      Confirm
    </AppButton>
  </div>
</template>
