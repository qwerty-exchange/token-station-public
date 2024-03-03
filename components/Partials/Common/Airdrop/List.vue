<script lang="ts" setup>
import { BigNumberInWei, Status, StatusType } from '@injectivelabs/utils'
import { Modal } from '~/types'

const modalStore = useModalStore()
const { values, validate } = useForm()
const { $onError } = useNuxtApp()

const openCreateAirdropModal = () => {
  modalStore.openModal({ type: Modal.CreateAirdrop })
}

const isModalOpen = computed(() => modalStore.modals[Modal.CreateAirdrop])

const handleModalClose = () => {
  modalStore.closeModal(Modal.CreateAirdrop)
}

const { value: name, errorMessage: nameError } = useStringFieldCustom({
  name: 'name',
  rule: 'required'
})

const status = reactive(new Status(StatusType.Idle))

const injFee = computed(
  // TODO
  () => new BigNumberInWei('1000000000000000000')
)

const handleCreateAirdrop = async () => {
  const { valid } = await validate()

  if (!valid) {
    return
  }

  status.setLoading()

  try {
    await new Promise((resolve) => setTimeout(() => resolve(true), 3000))

    if (true) {
      navigateTo('/airdrop/dupa')
    }
  } catch (e: any) {
    $onError(e)
  } finally {
    status.setIdle()
  }
}
</script>

<template>
  <div class="flex justify-between mb-4 gap-3 items-center">
    <p class="text-xl">Your Airdrops</p>
    <div class="flex justify-end gap-3 items-center">
      <AppButton class="font-semibold" @click="openCreateAirdropModal">
        <span class="text-gray-750">Create new Airdrop +</span>
      </AppButton>
    </div>
  </div>
  <div class="grid grid-cols-12 md:min-w-0">
    <span class="uppercase text-gray-700 whitespace-nowrap text-xs col-span-4">
      Name
    </span>
    <span
      class="uppercase text-gray-700 whitespace-nowrap text-xs text-right col-span-2"
    >
      Token
    </span>
    <span
      class="uppercase text-gray-700 whitespace-nowrap text-xs text-right col-span-2"
    >
      Start Date
    </span>
    <span
      class="uppercase text-gray-700 whitespace-nowrap text-xs text-right col-span-2"
    >
      End Date
    </span>
    <span
      class="uppercase text-gray-700 whitespace-nowrap text-xs text-right col-span-2"
    >
      Action
    </span>
    <div class="col-span-3" />
  </div>
  <div
    class="border-b border-gray-300 last-of-type:border-b-0 block md:min-w-0"
  >
    <div class="grid grid-cols-12 items-center py-4 box-content">
      <div class="col-span-4 align-center">Airdrop #1</div>
      <div class="col-span-2 align-center justify-self-end">Injective</div>
      <div class="col-span-2 align-center justify-self-end">
        {{
          new Date().toLocaleDateString('us-US', {
            timeZone: 'UTC',
            timeZoneName: 'short'
          })
        }}
      </div>
      <div class="col-span-2 align-center justify-self-end">
        {{
          new Date().toLocaleDateString('us-US', {
            timeZone: 'UTC',
            timeZoneName: 'short'
          })
        }}
      </div>
      <div class="col-span-2 align-center justify-self-end">
        <AppButton class="bg-gray-750 font-semibold"> Details </AppButton>
      </div>
    </div>
  </div>

  <div v-if="false" class="text-sm py-4 text-black text-center">
    You haven't created any airdrop yet
  </div>
  <AppModal
    class="bg-white"
    :is-open="isModalOpen"
    sm
    @modal:closed="handleModalClose"
  >
    <template #title>
      <h3>Create Airdrop</h3>
    </template>
    <div class="mb-6">
      <AppInput
        v-model="name"
        label="Name*"
        placeholder="Airdrop #1"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p v-if="nameError" class="text-red-500 text-xs mt-1">
        {{ nameError }}
      </p>
    </div>
    <AppFundValidator :inj-fee="injFee" />
    <div class="flex gap-4 items-center mt-2">
      <AppButton
        :status="status"
        class="w-full bg-gray-750 text-white font-semibold"
        @click="handleCreateAirdrop"
      >
        Confirm
      </AppButton>
    </div>
  </AppModal>
</template>
