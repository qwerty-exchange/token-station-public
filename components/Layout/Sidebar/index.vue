<script setup lang="ts" />

<template>
  <div
    class="flex-col w-64 fixed z-30 left-0 top-0 bottom-0 bg-gray-1000 hidden lg:flex justify-between text-white mt-14 pt-2"
  >
    <div>
      <NuxtLink
        to="/launch"
        class="p-4 block group hover:bg-gray-700 relative z-50"
        exact
        data-cy="header-trade-link"
      >
        <div class="flex items-center gap-2">
          <svg
            class="fill-gray-400"
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 256 256"
            height="20px"
            width="20px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M229.12,142.65a22.43,22.43,0,0,0-19.55-3.88l-45.24,10.4A26,26,0,0,0,140,114H89.94a29.78,29.78,0,0,0-21.21,8.79L45.52,146H16A14,14,0,0,0,2,160v40a14,14,0,0,0,14,14H120a6,6,0,0,0,1.46-.18l64-16a7.16,7.16,0,0,0,.89-.3L225.17,181l.33-.15a22.6,22.6,0,0,0,3.62-38.18ZM14,200V160a2,2,0,0,1,2-2H42v44H16A2,2,0,0,1,14,200Zm206.28-30-38.2,16.27L119.26,202H54V154.49l23.21-23.22A17.88,17.88,0,0,1,89.94,126H140a14,14,0,0,1,0,28H112a6,6,0,0,0,0,12h32a6,6,0,0,0,1.34-.15l67-15.41.24-.06A10.6,10.6,0,0,1,220.28,170ZM164,94a34.54,34.54,0,0,0,7.28-.78,34,34,0,1,0,25.46-42.43A34,34,0,1,0,164,94Zm62-10a22,22,0,1,1-22-22A22,22,0,0,1,226,84ZM164,38a21.94,21.94,0,0,1,21.51,17.49,34,34,0,0,0-15.38,25.65A22,22,0,1,1,164,38Z"
            ></path>
          </svg>
          <p class="font-semibold text-base text-white">Create Token</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/tokens"
        class="p-4 block group hover:bg-gray-700 relative z-50"
        exact
        data-cy="header-trade-link"
      >
        <div class="flex items-center gap-2">
          <AssetSettingsIcon class="w-5 h-5 fill-gray-400" />
          <p class="font-semibold text-base text-white">Manage Token</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/market"
        class="p-4 block group hover:bg-gray-700 relative z-50"
        data-cy="header-trade-link"
      >
        <div class="flex items-center gap-2">
          <BaseIcon
            name="graph-up"
            class="w-5 h-5 fill-gray-400 text-gray-400"
          />
          <p class="font-semibold text-base text-white">Launch Market</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/distribution"
        class="p-4 block group hover:bg-gray-700 relative z-50"
        data-cy="header-trade-link"
      >
        <div class="flex items-center gap-2">
          <BaseIcon name="user" class="w-5 h-5 fill-gray-400 text-gray-400" />
          <p class="font-semibold text-base text-white">Launch Airdrop</p>
        </div>
      </NuxtLink>
      <NuxtLink
        to="/snapshots"
        class="p-4 block group hover:bg-gray-700 relative z-50"
        data-cy="header-trade-link"
      >
        <div class="flex items-center gap-2">
          <svg
            class="fill-gray-400 stroke-gray-400 h-5 w-5"
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="m350.54 148.68-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h352a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
            ></path>
            <circle
              cx="256"
              cy="272"
              r="80"
              fill="none"
              stroke-miterlimit="10"
              stroke-width="32"
            ></circle>
            <path
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M124 158v-22h-24v22"
            ></path>
          </svg>
          <p class="font-semibold text-base text-white">Snapshots</p>
        </div>
      </NuxtLink>
      <!-- <NuxtLink
        to="/airdrop"
        class="p-4 block group hover:bg-gray-700 relative z-50"
        data-cy="header-trade-link"
      >
        <div class="flex items-center gap-2">
          <svg
            class="fill-gray-400 w-5 h-5"
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 256 256"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M232,120A104.12,104.12,0,0,0,128,16h0A104.12,104.12,0,0,0,24,120a7.94,7.94,0,0,0,3.05,6.27.93.93,0,0,0,.15.13L120,196v20h-8a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16h-8V196l92.8-69.6h0A8,8,0,0,0,232,120Zm-16.36-8H175.83c-1.54-37.95-13.91-62.43-25.11-77A88.2,88.2,0,0,1,215.64,112ZM128,34a76.89,76.89,0,0,1,13.88,16.22C149.49,62,158.45,81.87,159.82,112H96.18c1.37-30.13,10.33-50,17.94-61.74A76.92,76.92,0,0,1,128,34Zm26.4,94L128,175.53,101.6,128Zm-71.11,0,19.5,35.09L56,128Zm89.42,0H200l-46.79,35.09ZM105.28,35c-11.2,14.57-23.57,39.05-25.11,77H40.36A88.2,88.2,0,0,1,105.28,35Z"
            ></path>
          </svg>
          <p class="font-semibold text-base text-white">Airdrop</p>
        </div>
      </NuxtLink> -->
      <!-- <NuxtLink
        to="/liquidity"
        class="p-4 block group hover:bg-gray-700 relative z-50"
        exact
        data-cy="header-trade-link"
      >
        <div class="flex items-center gap-2">
          <BaseIcon name="swap" class="w-5 h-5 fill-gray-400 text-gray-400" />
          <p class="font-semibold text-base text-white">Liquidity</p>
        </div>
      </NuxtLink> -->
    </div>
    <div class="flex gap-2 items-center p-4">
      <p
        class="break-keep whitespace-nowrap font-semibold text-sm text-gray-300"
      >
        Built on
      </p>
      <div class="w-24">
        <AssetInjective />
      </div>
    </div>
  </div>
</template>
