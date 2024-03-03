<script lang="ts" setup>
const tokenStore = useTokenStore()

const { value: baseDenom, errorMessage: baseDenomError } = useStringFieldCustom(
  {
    name: 'baseDenom',
    rule: 'required'
  }
)
const { value: symbol, errorMessage: symbolError } = useStringFieldCustom({
  name: 'symbol',
  rule: 'required'
})

const baseDenomOptions = computed(() => [
  ...tokenStore.tokens?.map((item) => ({
    display: item.tokenType === null ? '' : item.symbol,
    value: item.denom
  }))
])
</script>

<template>
  <div class="grid grid-cols-2 gap-4 mb-6">
    <div>
      <div class="mb-4">
        <label class="block text-xs font-semibold mb-2">Type </label>
        <AppSelectField
          v-model="baseDenom"
          label="Base denom*"
          :options="baseDenomOptions"
          searchable
          :selected-class="'justify-between py-1 px-3 border border-gray-300'"
        >
          <template #selected-item="{ option }">
            <div v-if="option" class="p-2 bg-gray-200 cursor-defaul text-sm">
              <span v-if="option?.display?.length" class="font-semibold mr-2">
                {{ option?.display }}
              </span>
              <span class="font-semibold text-gray-600">
                {{ option?.value }}
              </span>
            </div>
          </template>
          <template #selected-option="{ option }">
            <span v-if="!option" class="text-gray-500"> Select </span>
            <span v-else>
              {{
                option?.display ||
                option?.value.slice(0, 12) + '...' + option?.value.slice(-5)
              }}
            </span>
          </template>

          <template #option="{ option }">
            <div>
              <span v-if="option?.display?.length" class="font-semibold mr-2">
                {{ option?.display }}
              </span>
              <span class="font-semibold text-gray-600">
                {{ option?.value }}
              </span>
            </div>
          </template>
        </AppSelectField>
      </div>
      <AppInput
        v-model="symbol"
        label="Symbol*"
        placeholder="INJ"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p v-if="symbolError" class="text-red-500 text-xs mt-1">
        {{ symbolError }}
      </p>
    </div>

    <div></div>
  </div>
</template>
