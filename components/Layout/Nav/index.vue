<script lang="ts" setup>
const walletStore = useWalletStore()
const router = useRouter()

const props = defineProps({
  isSidebarOpen: Boolean
})

const emit = defineEmits<{
  (e: 'sidebar:closed'): void
  (e: 'sidebar:opened'): void
}>()

const isUserConnectedProcessCompleted = ref(false)

const isUserWalletConnected = computed(() => walletStore.isUserWalletConnected)

watch(
  () => isUserWalletConnected,
  (newIsUserWalletConnected) => {
    if (!newIsUserWalletConnected) {
      isUserConnectedProcessCompleted.value = false
    }
  }
)

onMounted(() => {
  if (isUserWalletConnected) {
    isUserConnectedProcessCompleted.value = true
  }
})

function handleSidebarToggle() {
  if (props.isSidebarOpen) {
    return emit('sidebar:closed')
  }

  emit('sidebar:opened')
}
const appStore = useAppStore()

const envOptions = [
  { display: 'Testnet', value: 'testnet' },
  { display: 'Mainnet', value: 'mainnet' }
]

const modalValue = ref(appStore.env)
</script>

<template>
  <header
    class="w-full sticky top-0 z-40 h-12 lg:h-14 bg-gray-1000 flex items-center border-b border-b-gray-900"
    :class="{
      fixed: isSidebarOpen,
      relative: !isSidebarOpen
    }"
  >
    <div
      class="cursor-pointer pl-4 lg:pr-4 lg:border-r flex items-center"
      @click="router.push({ name: 'index' })"
    >
      <AssetLogo class="w-auto h-10 lg:h-12" alt="Token Station" />
    </div>
    <div class="flex-1 sm:px-2 lg:px-6 flex justify-end lg:justify-between">
      <div
        class="relative h-0 -z-10 w-0 opacity-0 lg:h-full lg:z-0 lg:w-full lg:opacity-100 flex items-center"
      >
        <LayoutNavMenu class="hidden lg:block" />
      </div>
      <div class="flex items-center">
        <AppSelect
          v-model="modalValue"
          :class="'text-gray-800 hidden lg:block'"
          :wrapper-class="'bg-white w-32 mr-2 justify-between py-1 px-3 rounded-lg'"
          :selected-class="' '"
          :options="envOptions"
          @update:modelValue="(x: any) => appStore.changeEnv(x as any)"
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
        <LayoutWallet />
      </div>
    </div>
    <button
      class="px-4 border-r border-gray-600 text-gray-200 lg:hidden"
      @click.stop="handleSidebarToggle"
    >
      <BaseIcon v-if="isSidebarOpen" name="close" class="w-6 h-6" />
      <BaseIcon v-else name="menu" class="w-6 h-6" />
    </button>
  </header>
</template>
