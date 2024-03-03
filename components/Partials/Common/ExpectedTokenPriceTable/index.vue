<script setup lang="ts">
import { BigNumber, BigNumberInBase } from '@injectivelabs/utils'

const minQtyTick = 1_000_000
const minQtyTicks = Array.from({ length: 12 }, (_v, k) =>
  k === 0 ? minQtyTick : minQtyTick / Math.pow(10, k)
)

const formatNumber = (value: number) => {
  return new BigNumberInBase(value).toFormat({
    groupSeparator: ',',
    decimalSeparator: '.',
    groupSize: 3
  })
}
const rewardsMenuOpen = ref(false)

function handleToggleTradeMenu() {
  rewardsMenuOpen.value = !rewardsMenuOpen.value
}
</script>

<template>
  <div class="text-black">
    <AppAccordion
      :is-open="rewardsMenuOpen"
      sm
      @panel:toggle="handleToggleTradeMenu"
    >
      <template #title>
        Refer to our guide on how to choose tick sizes.
      </template>
      <template #content>
        <table
          class="border-collapse border border-gray-300 w-full text-black text-sm"
        >
          <thead>
            <tr>
              <td class="border border-gray-300 p-1.5">
                Expected Price per Token Range (USDT)
              </td>
              <td class="border border-gray-300 p-1.5">
                Min Price Tick (USDT)
              </td>
              <td class="border border-gray-300 p-1.5">Min Qty Tick</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(minQtyTick, index) in minQtyTicks">
              <td class="border border-gray-300 p-1.5">
                <span>
                  {{ formatNumber(1 / (minQtyTick * 10)) }}
                </span>
                <span v-if="index !== minQtyTicks.length - 1">
                  -
                  {{ formatNumber(1 / minQtyTick) }}</span
                >
                <span v-if="index === minQtyTicks.length - 1">+</span>
              </td>
              <td class="border border-gray-300 p-1.5">
                {{ formatNumber(1 / (minQtyTick * 100_000)) }}
              </td>
              <td class="border border-gray-300 p-1.5">
                {{ formatNumber(minQtyTick) }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </AppAccordion>
  </div>
</template>
