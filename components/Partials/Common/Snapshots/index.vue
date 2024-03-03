<script lang="ts" setup>
import { HttpRequestException } from '@injectivelabs/exceptions'

const appStore = useAppStore()

type Snapshot = {
  id: number
  height: number
  date: string
  genesis: string
  xlsx: string
}

const getFormattedCurrentDate = () => {
  const currentDate = new Date()
  const formattedCurrentDate = `${currentDate.getUTCFullYear()}-${(
    currentDate.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`

  return formattedCurrentDate
}

const { $onError } = useNuxtApp()
const dateFilter = ref(getFormattedCurrentDate())

const { data } = await useFetch<{ snapshots: Array<Snapshot> }>(
  '/api/snapshots',
  {
    query: { date: new Date(dateFilter.value).getTime() },
    watch: [dateFilter],
    onRequestError({ response }) {
      $onError(new HttpRequestException(new Error(response?.statusText)))
    }
  }
)

const oneDay = 24 * 60 * 60 * 1_000
const filteredSnapshots = computed(() => {
  if (appStore.env === 'testnet') {
    return []
  }

  return data.value
    ? data.value.snapshots.filter((snapshot: any) => {
        const selectedDate = new Date(dateFilter.value).getTime()
        const snapshotDate = new Date(snapshot.date).getTime()
        return (
          snapshotDate <= selectedDate + 2 * oneDay &&
          snapshotDate >= selectedDate - oneDay
        )
      })
    : []
})

const mapDownloadLink = (link: string) => {
  const [cid, name] = link.replace('ipfs://', '').split('/')
  return `https://ipfs.filebase.io/ipfs/${cid}/${name}`
}
</script>

<template>
  <div class="flex justify-between mb-4 gap-3 items-center">
    <p class="text-xl">Genesis files</p>
    <div class="flex justify-end gap-3 items-center">
      <p>Date:</p>
      <BaseDatepicker
        class="border border-gray-300 text-sm px-2 w-32"
        v-model="dateFilter"
        utc
        auto-apply
        :minDate="1704070000000"
        :maxDate="Date.now()"
        :enable-time-picker="false"
      >
        <template #input-icon>
          <BaseIcon name="calendar" :class="['inline w-4 h-4']" />
        </template>
      </BaseDatepicker>
    </div>
  </div>
  <div class="grid grid-cols-12 md:min-w-0">
    <span class="uppercase text-gray-700 whitespace-nowrap text-xs col-span-5">
      Block
    </span>
    <span
      class="uppercase text-gray-700 whitespace-nowrap text-xs text-right col-span-5"
    >
      Date
    </span>
    <span
      class="uppercase text-gray-700 whitespace-nowrap text-xs text-right col-span-2"
    >
      Action
    </span>
    <div class="col-span-3" />
  </div>
  <div
    v-for="snapshot in filteredSnapshots"
    class="border-b border-gray-300 last-of-type:border-b-0 block md:min-w-0"
  >
    <div class="grid grid-cols-12 items-center py-4 box-content">
      <div class="col-span-5 align-center">
        <a
          :href="`https://explorer.injective.network/block/${snapshot.height}/`"
          class="hover:text-blue-500"
          target="_blank"
          >#{{ snapshot.height }}</a
        >
      </div>
      <div class="col-span-5 align-center justify-self-end">
        {{
          new Date(snapshot.date).toLocaleString('us-US', {
            timeZone: 'UTC',
            timeZoneName: 'short'
          })
        }}
      </div>
      <div class="col-span-2 align-center justify-self-end">
        <PartialsCommonSnapshotsDownloadButton
          :files="[
            { name: 'json', file: mapDownloadLink(snapshot.genesis) },
            { name: 'xlsx', file: mapDownloadLink(snapshot.xlsx) }
          ]"
        />
      </div>
    </div>
  </div>
  <div
    v-if="!filteredSnapshots.length"
    class="text-sm py-4 text-black text-center"
  >
    No snapshot of the selected date
  </div>
</template>

<style>
.dp__input {
  font-size: 14px;
  padding: 4px 0 4px 24px;
  border: none;
}
</style>
