<script lang="ts" setup>
import {
  useStringFieldCustom,
  useNumberFieldCustom
} from '~/composables/useForm'
const { value: symbol, errorMessage: symbolError } = useStringFieldCustom({
  name: 'symbol',
  rule: 'required'
})
const { value: name, errorMessage: nameError } = useStringFieldCustom({
  name: 'name',
  rule: 'required'
})
const { value: description, errorMessage: descriptionError } =
  useStringFieldCustom({
    name: 'description',
    rule: 'required'
  })
const { value: uri, errorMessage: uriError } = useStringFieldCustom({
  name: 'logo',
  rule: 'required'
})
const { value: decimals, errorMessage: decimalsError } = useNumberFieldCustom({
  name: 'decimals',
  rule: 'required|between:0,18',
  initialValue: 6
})
</script>

<template>
  <div class="grid grid-cols-2 gap-4 mb-6">
    <div>
      <AppInput
        v-model="symbol"
        label="Symbol*"
        placeholder="INJ"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p v-if="symbolError" class="text-red-500 text-xs mt-1">
        {{ symbolError }}
      </p>
    </div>
    <div>
      <AppInput
        v-model="name"
        label="Name*"
        placeholder="Injective"
        input-classes="focus:border focus:border-solid focus:border-gray-300"
        class="w-full max-w-96 border border-gray-300 py-1"
        :transparent-bg="true"
      />
      <p v-if="nameError" class="text-red-500 text-xs mt-1">
        {{ nameError }}
      </p>
    </div>
  </div>
  <div class="mb-6">
    <AppInput
      v-model="description"
      label="Description*"
      placeholder="Injective Token"
      input-classes="focus:border focus:border-solid focus:border-gray-300"
      class="w-full max-w-96 border border-gray-300 py-1"
      :transparent-bg="true"
    />
    <p v-if="descriptionError" class="text-red-500 text-xs mt-1">
      {{ descriptionError }}
    </p>
  </div>
  <div class="mb-6">
    <AppLogoUploader v-model="uri" />
    <p v-if="uriError" class="text-red-500 text-xs mt-1">
      {{ uriError }}
    </p>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div class="mb-6">
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold">Decimals* </label>
        <CommonInfoTooltip
          :tooltip="`Decimals represent the base units of a token. We recommend setting 6 decimals for native tokens on Injective.`"
        />
      </div>

      <AppInputNumeric
        v-model="decimals"
        clear-on-paste
        :min="1"
        :max="18"
        max-decimals="0"
        input-classes="text-black h-auto"
        wrapper-classes="w-full max-w-96 border border-gray-300 py-1 text-black"
        :transparent-bg="true"
      />
      <p v-if="decimalsError" class="text-red-500 text-xs mt-1">
        {{ decimalsError }}
      </p>
    </div>
  </div>
</template>
