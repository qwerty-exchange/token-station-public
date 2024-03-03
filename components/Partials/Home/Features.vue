<script setup lang="ts" />
<template>
  <div class="mb-8 lg:w-1/2 text-center mx-auto">
    <h2
      class="text-gray-900 font-bold text-[36px] leading-[58px] sm:text-5xl sm:leading-[60px] 3xl:leading-[72px] 3xl:text-[48px] 4xl:leading-[77px] 4xl:text-[48px]"
    >
      Tokens made easy
    </h2>
  </div>
  <div
    class="flex-col md:flex-row flex justify-center text-black gap-8 mb-8 md:mr-24"
  >
    <div class="w-full md:max-w-[300px] shadow-helix p-4 rounded-lg">
      <BaseIcon name="governance" class="mb-2 w-8 h-8" />
      <p class="font-semibold text-xl">Launch Token</p>
      <p class="text-sm">Create your token on injective.</p>
    </div>
    <div class="w-full md:max-w-[300px] shadow-helix p-4 rounded-lg">
      <BaseIcon name="gear" class="mb-2 w-7 h-7" />
      <p class="font-semibold text-xl">Manage</p>
      <p class="text-sm">Manage your token.</p>
    </div>
  </div>
  <div
    class="flex-col md:flex-row flex justify-center text-black gap-8 mb-36 md:ml-24"
  >
    <div class="w-full md:max-w-[300px] shadow-helix p-4 rounded-lg">
      <svg
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        height="32px"
        width="32px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path
          d="M13 8l-9.383 9.418a2.091 2.091 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0l9.407 -9.385"
        ></path>
        <path
          d="M9 3h4.586a1 1 0 0 1 .707 .293l6.414 6.414a1 1 0 0 1 .293 .707v4.586a2 2 0 1 1 -4 0v-3l-5 -5h-3a2 2 0 1 1 0 -4z"
        ></path>
      </svg>
      <p class="font-semibold text-xl mt-2">Mint</p>
      <p class="text-sm">Mint new tokens effortlessly.</p>
    </div>
    <div class="w-full md:max-w-[300px] shadow-helix p-4 rounded-lg">
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 16 16"
        height="32px"
        width="32px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"
        ></path>
      </svg>
      <p class="font-semibold text-xl mt-2">Burn</p>
      <p class="text-sm">Slash the supply by burning tokens.</p>
    </div>
  </div>
</template>
