<script lang="ts" setup />

<template>
  <AppHocLoading class="h-full">
    <div class="container">
      <div class="w-full mx-auto my-4 md:my-12 4xl:w-4/5 relative text-black">
        <CommonPageTitle
          title="Provide Liquidity"
          subtitle="Launch your trading pair and provide liquidity permissionlessly through advanced strategies."
        />
        <div class="grid sm:grid-cols-2 3xl:grid-cols-3 gap-8">
          <div class="grayscale text-gray-600 cursor-not-allowed">
            <div
              class="bg-black h-64 px-12 flex justify-center items-center rounded-t-xl"
            >
              <img src="/liquidity-providers/mito.svg" />
            </div>
            <div
              class="p-6 pb-4 border border-gray-300 border-t-0 rounded-b-xl"
            >
              <h3 class="font-bold text-2xl">Mito</h3>
              <p class="mb-4 sm:h-20">
                A groundbreaking Web3 protocol that revolutionizes automated
                trading and yield generation.
              </p>
            </div>
          </div>
          <a
            class="hover:shadow-helix transition"
            target="_blank"
            href="https://elixir.finance/"
          >
            <div
              class="bg-black h-64 px-12 flex justify-center items-center rounded-t-xl"
            >
              <img src="/liquidity-providers/elixir.webp" />
            </div>
            <div
              class="p-6 pb-4 border border-gray-300 border-t-0 rounded-b-xl"
            >
              <h3 class="font-bold text-2xl">Elixir Finance</h3>
              <p class="mb-4 sm:h-20">
                Next-gen liquidity provisioning. Unlocking open participation in
                market making.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </AppHocLoading>
</template>
