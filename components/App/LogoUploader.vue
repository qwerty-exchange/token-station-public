<script lang="ts" setup>
import { Status } from '@injectivelabs/utils'
import { NFTStorage, File } from 'nft.storage'
import { getImageSrc } from '~/app/utils/helpers'

defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const client = new NFTStorage({
  token: import.meta.env.VITE_NFT_STORAGE_TOKEN
})

const uploadStatus = reactive(new Status())
const fileInput = ref<HTMLInputElement | undefined>()

const handleButtonClick = () => {
  fileInput.value?.click()
}

const handleFileChange = async (e: Event) => {
  uploadStatus.setLoading()
  const file = fileInput.value!.files!.item(0) as File

  const result = await client.storeBlob(file)

  emit('update:modelValue', `ipfs://${result}`)
  uploadStatus.setIdle()
}
</script>

<template>
  <label class="block text-xs font-semibold mb-2">Logo* </label>
  <div v-if="modelValue?.length" class="flex mb-2">
    <div class="max-w-4xs border border-gray-300">
      <img
        :src="`${getImageSrc(modelValue)}`"
        @error="emit('update:modelValue', '')"
      />
    </div>
  </div>
  <div class="flex items-end gap-4">
    <AppButton
      :status="uploadStatus"
      class="bg-gray-750 font-semibold"
      @click="handleButtonClick"
    >
      Upload
    </AppButton>
  </div>
  <input
    ref="fileInput"
    type="file"
    accept="image/*"
    style="display: none"
    @change="handleFileChange"
  />
</template>
