<script setup lang="ts" />

<template>
  <div
    class="block md:grid rounded-[20px] gap-16 p-6 md:p-16 lg:px-6 lg:py-8 2xl:px-20 2xl:py-16 bg-cover grid-cols-2 items-center shadow-helix mb-24 md:mb-36"
  >
    <div
      class="flex flex-col-reverse grid-cols-2 gap-4 md:gap-16 md:grid col-span-12 lg:col-span-6 3xl:col-span-6"
    >
      <div>
        <h1
          class="text-gray-900 font-bold text-[36px] leading-10 sm:text-5xl 3xl:leading-[72px] 3xl:text-[60px] 4xl:leading-[77px] 4xl:text-[64px] mb-4"
        >
          Launch a Token on Injective
        </h1>
        <p class="text-gray-900 mt-4 text-xl md:text-base 3xl:text-xl mb-6">
          Create and manage tokens seamlessly on the fastest blockchain
          built&nbsp;for&nbsp;finance.
        </p>
      </div>
      <div class="flex md:justify-center py-4 md:py-0">
        <AssetInjective class="w-64 md:w-80 text-gray-900" />
      </div>
    </div>
  </div>
</template>
