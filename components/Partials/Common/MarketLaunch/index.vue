<script setup lang="ts">
import { BigNumberInWei } from '@injectivelabs/utils'
import { QuoteDenoms } from '~/app/data/quoteDenom'

enum LaunchType {
  Instant = 'Instant',
  Gov = 'Gov'
}

const { env } = useAppStore()
const marketsStore = useMarketsStore()
const tokenStore = useTokenStore()

const { value: baseDenom, errorMessage: baseDenomError } = useStringFieldCustom(
  {
    name: 'baseDenom',
    rule: 'required'
  }
)

const { value: launchType } = useStringFieldCustom({
  name: 'launchType',
  initialValue: LaunchType.Instant,
  rule: 'required'
})

const quoteDenomOptions = computed(() => QuoteDenoms[env])

const { value: quoteDenom } = useStringFieldCustom({
  name: 'quoteDenom',
  rule: 'required',
  initialValue: quoteDenomOptions.value[0].value
})

const {
  value: ticker,
  errorMessage: tickerError,
  resetField: resetTicker,
  setValue: setTicker
} = useStringFieldCustom({
  name: 'ticker',
  rule: 'required'
})

const {
  value: baseDenomDecimals,
  errorMessage: baseDenomDecimalsError,
  setValue: setBaseDenomDecimals,
  resetField: resetBaseDenomDecimals
} = useNumberFieldCustomEmptyDefault({
  name: 'baseDenomDecimals',
  rule: 'required|between:0,18'
})

const {
  value: quoteDenomDecimals,
  errorMessage: quoteDenomDecimalsError,
  setValue: setQuoteDenomDecimals
} = useNumberFieldCustom({
  name: 'quoteDenomDecimals',
  initialValue: 6,
  rule: 'required|between:0,18'
})

const { value: baseTick, errorMessage: baseTickError } = useStringFieldCustom({
  name: 'baseTick',
  rule: 'required',
  dynamicRule: computed(() => `required|tick:${baseDenomDecimals.value}`)
})

const { value: quoteTick, errorMessage: quoteTickError } = useStringFieldCustom(
  {
    name: 'quoteTick',
    rule: 'required',
    dynamicRule: computed(() => `required|tick:${quoteDenomDecimals.value}`)
  }
)

const { value: proposalContent, errorMessage: proposalContentError } =
  useStringFieldCustom({
    name: 'proposalContent',
    dynamicRule: computed(() => {
      return launchType.value === LaunchType.Gov ? 'required' : ''
    })
  })

const injFee = computed(() => {
  if (!marketsStore.params) {
    return new BigNumberInWei(0)
  }

  const value =
    launchType.value === LaunchType.Gov
      ? marketsStore.params.govDeposit
      : marketsStore.params.spotMarketInstantListingFee

  return new BigNumberInWei(value.amount || 0)
})

const baseDenomMetadata = computed(() => {
  const denom = tokenStore.tokens.find((x) => x.denom === baseDenom.value)
  return denom
})

const baseDenomOptions = computed(() => [
  ...tokenStore.tokens?.map((item) => ({
    display: item.tokenType === null ? '' : item.symbol,
    value: item.denom
  }))
])

const quoteDenomMetadata = computed(() => {
  const denom = tokenStore.tokens.find((x) => x.denom === quoteDenom.value)
  return denom
})

watch(baseDenom, () => {
  const denomDecimals = baseDenomMetadata.value?.decimals

  if (denomDecimals) {
    setBaseDenomDecimals(denomDecimals)
  } else {
    resetBaseDenomDecimals()
  }
})

watch(quoteDenom, () => {
  const denomDecimals = quoteDenomMetadata.value?.decimals

  if (denomDecimals) {
    setQuoteDenomDecimals(denomDecimals)
  }
})

watchArray([baseDenom, quoteDenom], () => {
  if (baseDenom.value && quoteDenom.value) {
    if (baseDenomMetadata.value?.symbol) {
      setTicker(
        `${baseDenomMetadata.value?.symbol.toLocaleUpperCase()}/${quoteDenomMetadata.value?.symbol.toLocaleUpperCase()}`
      )
    } else {
      resetTicker()
    }
  }
})
</script>

<template>
  <div class="mb-6">
    <div class="flex mb-2 items-center gap-1">
      <label class="block text-xs font-semibold">Type </label>
      <CommonInfoTooltipWithElement>
        <template #content>
          <div>
            <div v-if="launchType === LaunchType.Gov">
              Create a new spot market through a governance proposal with a
              deposit of
              {{ injFee.toBase(18).toFormat(2, BigNumberInWei.ROUND_DOWN) }}
              INJ. Depending on the outcome of the proposal, your deposit might
              be burned. For more information read
              <a
                class="text-gray-300 underline"
                href="https://blog.injective.com/injective-governance-proposal-procedure/"
                target="_blank"
                >here </a
              >.
            </div>
            <div v-if="launchType === LaunchType.Instant">
              Create a new spot market instantly without governance by paying a
              listing fee of
              {{ injFee.toBase(18).toFormat(2, BigNumberInWei.ROUND_DOWN) }}
              INJ.
            </div>
          </div>
        </template>
      </CommonInfoTooltipWithElement>
    </div>
    <div>
      <AppSelect
        v-model="launchType"
        :options="[
          {
            display: 'Instant Spot Market Launch',
            value: LaunchType.Instant
          },
          {
            display: 'Government Spot Market Launch',
            value: LaunchType.Gov
          }
        ]"
        :wrapper-class="'justify-between py-1 px-3 border  border-gray-300'"
      >
        <template #default="{ selected }">
          <span v-if="selected">
            {{ selected.display }}
          </span>
        </template>

        <template #option="{ option }">
          <span>
            {{ option.display }}
          </span>
        </template>
      </AppSelect>
    </div>
  </div>
  <div v-if="launchType === LaunchType.Gov" class="mb-6 flex flex-col">
    <label class="block text-xs font-semibold mb-2">
      Proposal Description*
    </label>

    <textarea
      v-model="proposalContent"
      class="p-2 w-full border border-gray-300"
    ></textarea>
    <p class="text-red-500 text-xs mt-1">
      {{ proposalContentError }}
    </p>
  </div>

  <div class="grid grid-cols-2 gap-x-4 gap-y-6 mb-4">
    <div>
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold"> Base Denom* </label>
        <CommonInfoTooltip
          tooltip="This is the asset you would like to trade."
        />
      </div>
      <AppSelectField
        v-model="baseDenom"
        label="Base denom*"
        :options="baseDenomOptions"
        searchable
        :selected-class="'justify-between py-1 px-3 border  border-gray-300'"
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
      <p class="text-red-500 text-xs mt-1">
        {{ baseDenomError }}
      </p>
    </div>
    <div>
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold"> Quote Denom* </label>
        <CommonInfoTooltip
          tooltip="This is the asset by which the market will be denominated. You can buy the base asset with the quote asset, common examples include USDT and USDC."
        />
      </div>

      <AppSelect
        v-model="quoteDenom"
        label="Quote Denom*"
        :options="quoteDenomOptions"
        :wrapper-class="'justify-between py-1 px-3 border  border-gray-300'"
      >
        <template #default="{ selected }">
          <span v-if="selected">
            {{ selected.display }}
          </span>
          <span v-else class="text-gray-500"> Select </span>
        </template>

        <template #option="{ option }">
          <span>
            {{ option.display }}
          </span>
        </template>
      </AppSelect>
    </div>

    <div class="col-span-2">
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold"> Ticker* </label>
        <CommonInfoTooltip
          tooltip="The ticker for the market, i.e. INJ/USDT."
        />
      </div>
      <AppInput
        v-model="ticker"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p class="text-red-500 text-xs mt-1">
        {{ tickerError }}
      </p>
    </div>
    <div>
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold">Base Denom Decimals* </label>
        <CommonInfoTooltipWithElement v-if="baseDenomMetadata">
          <template #content>
            <div v-if="baseDenomMetadata.decimals">
              The metadata for the asset was found <br />
              on our database.
            </div>
            <div v-if="!baseDenomMetadata.decimals">
              The metadata for the asset could not be found.
              <br /><br />For ERC-20 tokens, you can find the decimals on the
              Etherscan contract and set them.

              <br /><br />You can also submit the metadata
              <a
                class="text-gray-300 underline"
                target="_blank"
                href="https://github.com/InjectiveLabs/injective-ts/tree/dev/packages/token-metadata"
                >here</a
              >
              to have support for your token across Injective dApps.
            </div>
          </template>
        </CommonInfoTooltipWithElement>
      </div>
      <AppInputNumeric
        v-model="baseDenomDecimals"
        clear-on-paste
        :disabled="!baseDenomMetadata || baseDenomMetadata.decimals"
        :min="1"
        :max="18"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p class="text-red-500 text-xs mt-1">
        {{ baseDenomDecimalsError }}
      </p>
    </div>
    <div>
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold"
          >Quote Denom Decimals*
        </label>
        <CommonInfoTooltipWithElement>
          <template #content>
            <div>
              The metadata for the asset was found <br />
              on our database.
            </div>
          </template>
        </CommonInfoTooltipWithElement>
      </div>
      <AppInputNumeric
        v-model="quoteDenomDecimals"
        v-validate="{ required: true }"
        placeholder="1"
        clear-on-paste
        :disabled="true"
        :min="1"
        :max="18"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p class="text-red-500 text-xs mt-1">
        {{ quoteDenomDecimalsError }}
      </p>
    </div>
    <div class="col-span-2 grid grid-cols-2 gap-x-4">
      <div>
        <div class="flex mb-2 items-center gap-1">
          <label class="block text-xs font-semibold">Price Tick Size* </label>
          <CommonInfoTooltipWithElement>
            <template #content>
              Defines the minimum tick size of the order's price and margin.
              <br /><br />For example, the price tick size in the INJ/USDT
              market is 0.001. Thus, the INJ price in USDT has 3 decimals.<br /><br />
              The price of the base asset will determine the most appropriate
              tick size, visit the Injective Explorer
              <a
                class="text-gray-300 underline"
                href="https://explorer.injective.network/markets/trading-rules/"
                target="_blank"
                >Injective Explorer</a
              >
              to view active markets and examples.
            </template>
          </CommonInfoTooltipWithElement>
        </div>

        <AppInput
          v-model="baseTick"
          placeholder="0.00001"
          input-classes="focus:border focus:border-solid focus:border-gray-300"
          class="w-full max-w-96 border border-gray-300 py-1"
          :transparent-bg="true"
        />
        <p class="text-red-500 text-xs mt-1">
          {{ baseTickError }}
        </p>
      </div>
      <div>
        <div class="flex mb-2 items-center gap-1">
          <label class="block text-xs font-semibold"
            >Quantity Tick Size*
          </label>
          <CommonInfoTooltipWithElement>
            <template #content>
              Defines the minimum tick size of the order's quantity.
              <br /><br />For example, the quantity tick size in the INJ/USDT
              market is 0.001. Thus, the minimum amount you can trade is 0.001
              INJ. <br /><br />
              The price of the base asset will determine the most appropriate
              tick size, visit the
              <a
                class="text-gray-300 underline"
                href="https://explorer.injective.network/markets/trading-rules/"
                target="_blank"
                >Injective Explorer</a
              >
              to view active markets and examples.
            </template>
          </CommonInfoTooltipWithElement>
        </div>
        <AppInput
          v-model="quoteTick"
          placeholder="1"
          input-classes="focus:border focus:border-solid focus:border-gray-300"
          class="w-full max-w-96 border border-gray-300 py-1"
          :transparent-bg="true"
        />
        <p class="text-red-500 text-xs mt-1">
          {{ quoteTickError }}
        </p>
      </div>
      <div class="col-span-2"><PartialsCommonExpectedTokenPriceTable /></div>
    </div>
  </div>
  <AppFundValidator :inj-fee="injFee" />
</template>
