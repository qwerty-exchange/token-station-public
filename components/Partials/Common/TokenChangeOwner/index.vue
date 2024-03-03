<script lang="ts" setup>
import { Status, StatusType } from '@injectivelabs/utils'
import { useIsFieldDirty, useIsFormValid } from 'vee-validate'
import { Modal } from '@/types'

const tokenStore = useTokenStore()

const props = defineProps({
  denom: String!
})

const { validate, resetForm } = useForm()
const isFormValid = useIsFormValid()
const { $onError } = useNuxtApp()

const modalStore = useModalStore()
const walletStore = useWalletStore()

const { success } = useNotifications()

enum AdminMode {
  Change = 'Change',
  Remove = 'Remove'
}

const token = computed(
  () => tokenStore.userTokens.find((x) => x.denom === props.denom)!
)

const adminMode = ref(AdminMode.Change)
const status = reactive(new Status(StatusType.Idle))

const {
  value: account,
  setValue: accountSetValue,

  errors: accountErrors
} = useStringFieldCustom({
  name: 'New Admin Address',
  initialValue: '',
  dynamicRule: computed(() => {
    return 'required|injAddress'
  })
})

const isTouched = useIsFieldDirty('New Admin Address')

const handleOpenModal = () => {
  modalStore.openModal({ type: Modal.ChangeAdmin })
}

watch(adminMode, () => {
  resetForm()
  if (adminMode.value === AdminMode.Remove) {
    accountSetValue('inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49')
    validate()
  }
})

const handleChangeAdmin = async () => {
  status.setLoading()

  await tokenStore
    .changeTokenAdmin(props.denom!, account.value)
    .then(() => {
      success({
        title: 'Success'
      })
    })
    .catch($onError)
    .finally(() => {
      modalStore.closeModal(Modal.ChangeAdmin)
      status.setIdle()
    })
}

function handleModalClose() {
  modalStore.closeModal(Modal.ChangeAdmin)
}

const isModalOpen = computed(() => modalStore.modals[Modal.ChangeAdmin])
</script>

<template>
  <div>
    <label class="block text-xs font-semibold mb-2"> Action Type* </label>
    <div class="mb-4">
      <AppSelect
        v-model="adminMode"
        :options="[
          { display: 'Set New Admin', value: AdminMode.Change },
          { display: 'Remove Admin', value: AdminMode.Remove }
        ]"
        :wrapper-class="'w-40 justify-between py-1 px-3 border mb-2 border-gray-300'"
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
      <div
        v-if="adminMode === AdminMode.Remove"
        class="text-sm text-red-500 leading-tight mb-4"
      >
        Attention! This action is irrevertable! If you remove the admin, nobody
        can manage the token including burn, mint and metadata change actions!
      </div>
    </div>

    <div v-if="adminMode === AdminMode.Change" class="mb-4">
      <AppInput
        v-model="account"
        label="New Admin Address*"
        :placeholder="walletStore.injectiveAddress"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
    </div>
    <AppButton
      :disabled="!isFormValid"
      class="bg-gray-750 font-semibold"
      @click="handleOpenModal"
    >
      {{ adminMode == AdminMode.Change ? 'Set New Admin' : 'Remove Admin' }}
    </AppButton>
  </div>

  <AppModal
    class="bg-white"
    :is-open="isModalOpen"
    :is-always-open="!status.isIdle()"
    sm
    @modal:closed="handleModalClose"
  >
    <template #title>
      <h3>Admin settings</h3>
    </template>
    <p class="text-2xl">{{ token.name }}</p>
    <p class="text-sm text-gray-500 mb-4">
      {{ token.denom }}
    </p>
    <div class="border border-gray-300 rounded-lg p-4 mb-4">
      <p class="text-sm font-semibold">Current Admin Address</p>
      <p class="text-red-500 font-semibold text-sm mb-2">{{ token.admin }}</p>
      <p class="text-sm font-semibold">New Admin Address</p>
      <p class="font-semibold text-sm">
        <span v-if="adminMode === AdminMode.Remove" class="text-red-500">
          Empty
        </span>
        <span v-if="adminMode === AdminMode.Change" class="text-green-500">
          {{ account }}
        </span>
      </p>
    </div>
    <AppButton
      :status="status"
      class="w-full bg-gray-750 text-white font-semibold"
      @click="handleChangeAdmin"
    >
      Confirm
    </AppButton>
  </AppModal>
</template>
