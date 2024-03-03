<script lang="ts" setup>
import { Status, StatusType } from '@injectivelabs/utils'
import { BusEvents } from '@/types'

const appStore = useAppStore()
const walletStore = useWalletStore()
const accountStore = useAccountStore()

const { $onError } = useNuxtApp()

const status = reactive(new Status(StatusType.Loading))
const isOpenSidebar = ref(false)

const container = computed(() => document.getElementById('pro'))

onMounted(() => {
  Promise.all([walletStore.init()])
    .catch($onError)
    .finally(() => {
      status.setIdle()
    })

  // Actions that should't block the app from loading

  useEventBus<string>(BusEvents.NavLinkClicked).on(onCloseSideBar)
})

onWalletConnected(() => {
  Promise.all([accountStore.fetchAccountPortfolio()]).catch($onError)
})

function onOpenSideBar() {
  isOpenSidebar.value = true

  container.value?.classList.add('overflow-y-hidden')
}

function onCloseSideBar() {
  if (isOpenSidebar.value) {
    isOpenSidebar.value = false

    container.value?.classList.remove('overflow-y-hidden')
  }
}
</script>

<template>
  <div
    id="pro"
    class="flex min-h-screen max-h-screen bg-gray-1000 text-gray-100 relative overflow-x-hidden"
  >
    <transition name="page" appear>
      <div class="min-h-screen w-full">
        <AppHocLoading :status="status" class="h-full">
          <div class="w-full">
            <LayoutSidebarMobile
              v-bind="{
                isOpenSidebar
              }"
              @sidebar:closed="onCloseSideBar"
            />
            <client-only>
              <div class="bg-gray-1000">
                <LayoutNav
                  :is-sidebar-open="isOpenSidebar"
                  @sidebar:opened="onOpenSideBar"
                  @sidebar:closed="onCloseSideBar"
                />
                <div
                  class="bg-white bg-[url(/images/helix-hero-bg.svg)] bg-no-repeat bg-[length:100vw_100%]"
                >
                  <LayoutSidebar />
                  <main
                    class="flex flex-wrap relative min-h-screen-excluding-header lg:ml-64 flex-col"
                  >
                    <div class="flex-auto">
                      <NuxtPage />
                    </div>
                    <LayoutFooter />
                  </main>
                </div>

                <div id="modals" />
              </div>
            </client-only>
          </div>
        </AppHocLoading>
      </div>
    </transition>
    <BaseNotifications
      class="z-[1110] fixed inset-0 flex flex-col gap-2 justify-end items-end p-6 pointer-events-none"
    >
      <template #notification="{ notification }">
        <BaseNotification
          :notification="notification"
          class="pointer-events-auto bg-gray-800"
        >
          <template #close="{ closeNotification }">
            <BaseIcon
              name="close-bold"
              class="min-w-4 hover:text-blue-500 text-white w-4 h-4"
              @click="closeNotification"
            />
          </template>
        </BaseNotification>
      </template>
    </BaseNotifications>
  </div>
</template>

<style lang="css">
.router-link-exact-active {
  @apply bg-gray-700 bg-opacity-80;
}
.router-link-active {
  @apply bg-gray-700 bg-opacity-80;
}
</style>
