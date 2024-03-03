<script lang="ts" setup />

<template>
  <div class="block lg:hidden">
    <LayoutNavMenuItem :to="{ name: 'index' }" class="block lg:hidden">
      {{ $t('navigation.home') }}
    </LayoutNavMenuItem>
    <LayoutNavMenuItem to="/launch" class="block" data-cy="header-markets-link">
      Create Token
    </LayoutNavMenuItem>
    <LayoutNavMenuItem
      :to="{ name: 'tokens' }"
      class="block"
      data-cy="header-markets-link"
    >
      Manage Token
    </LayoutNavMenuItem>
    <!-- <LayoutNavMenuItem
      :to="{ name: 'liquidity' }"
      class="block"
      data-cy="header-markets-link"
    >
      Liquidity
    </LayoutNavMenuItem> -->
  </div>
</template>
