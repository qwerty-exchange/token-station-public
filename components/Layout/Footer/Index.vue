<script lang="ts" setup />

<template>
  <footer class="text-black p-4">
    <div class="flex flex-row items-stretch justify-between">
      <p class="text-2xs">
        Copyright © {{ new Date().getFullYear() }} Qwerty Team. All rights
        reserved.
      </p>

      <div class="flex items-center">
        <a
          class="w-6 h-6 text-black hover:text-blue-500 mr-4"
          href="https://github.com/qwerty-exchange/token-station-public"
          target="_blank"
        >
          <AssetGithubLogo />
        </a>
        <a
          class="w-6 h-6 text-black hover:text-blue-500 mr-4"
          href="https://discord.com/invite/injective"
          target="_blank"
        >
          <BaseIcon name="discord-circle" />
        </a>

        <a
          class="w-6 h-6 text-black hover:text-blue-500 mr-4"
          href="https://twitter.com/injective_"
          target="_blank"
        >
          <BaseIcon name="twitter-circle" />
        </a>

        <a
          class="w-6 h-6 text-black hover:text-blue-500 mr-4"
          href="https://t.me/joininjective"
          target="_blank"
        >
          <BaseIcon name="telegram-circle" />
        </a>
      </div>
    </div>
  </footer>
</template>
