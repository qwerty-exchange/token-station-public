<script lang="ts" setup>
import { BigNumber, BigNumberInWei, Status } from '@injectivelabs/utils'
import { getEthereumAddress, getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { read, utils } from 'xlsx'

const CHUNK_SIZE = 2500

const tokenStore = useTokenStore()
const { copy } = useClipboard()

const accountStore = useAccountStore()

const { $onError } = useNuxtApp()
const appStore = useAppStore()

const { success } = useNotifications()

const { resetForm, validate } = useForm()

const fileStatus = reactive(new Status())
const status = reactive(new Status())

const fileInput = ref<HTMLInputElement | undefined>()

const handleButtonClick = () => {
  fileInput.value?.click()
}

enum txStatus {
  Finished = 'Finished',
  Processing = 'Processing',
  Pending = 'Pending',
  Error = 'Error'
}

//const distributionList = ref([] as any[])
//const distributionListError = ref('')
const batchList = reactive({ tasks: [] as any })

const distributionListSumAmount = computed(() =>
  distributionList.value
    .map((x: any) => x.amount)
    .reduce((a, b) => a.plus(new BigNumberInWei(b)), new BigNumberInWei(0))
    .toBase(tokenDecimals.value)
    .toFormat(4!, BigNumberInWei.ROUND_UP)
)

const userHaveEnoughtFund = computed(() => {
  if (accountBalance.value === undefined) {
    return true
  }

  return new BigNumberInWei(accountBalance.value).isGreaterThanOrEqualTo(
    distributionList.value
      .map((x: any) => x.amount)
      .reduce(
        (a, b) => a.plus(new BigNumberInWei(b)),
        new BigNumberInWei(0)
      ) as BigNumberInWei
  )
})

const handleFileChange = async (e: Event) => {
  fileStatus.setLoading()
  setDistributionList({
    touched: true,
    errors: [],
    value: []
  })

  try {
    const file = fileInput.value!.files!.item(0) as File
    const data = read(await file.arrayBuffer(), {
      raw: true,
      sheets: 'Result',
      sheet: 'Result',
      dense: true
    })

    const sheet = data.Sheets['Result'] || data.Sheets[data.SheetNames[0]]
    var aoa = utils.sheet_to_json(sheet, {
      header: 1,
      range: 'A1:B1048575',
      blankrows: false
    })

    const list = aoa.map((x: any, index: number) => {
      try {
        debugger
        const [address, amount] = x
        if (!address || !amount) {
          throw Error('Error file format')
        }
        const addressInj = getInjectiveAddress(
          getEthereumAddress(address.trim())
        )
        const amountBig = new BigNumber(amount)

        return {
          address: addressInj,
          amount: amountBig.toString()
        }
      } catch (e) {
        if (index != 0) {
          throw Error('Error file format:' + index)
        }
      }
    })

    // distributionList.value = buffer
    setDistributionList({
      value: list.filter((x) => x)
    })
  } catch (e: any) {
    setDistributionList({
      errors: [(distributionListError.value = e.message)]
    })
    //  distributionListError.value = e.message
    throw e
  } finally {
    batchList.tasks = []
    fileStatus.setIdle()
  }
}

const token = computed(
  () => tokenStore.tokens.find((x) => x.denom === baseDenom.value)!
)
const tokenDecimals = computed(() => token.value?.decimals)

const accountBalance = computed(() => accountStore.balanceMap[baseDenom.value])
const accountFormated = computed(() =>
  new BigNumberInWei(accountBalance.value || 0)
    .toBase(tokenDecimals.value)
    .toFormat(4!, BigNumberInWei.ROUND_UP)
)

const handleBatchTransfer = async (retry = false) => {
  if (!retry) {
    batchList.tasks = []
  }

  status.setLoading()

  if (batchList.tasks.length == 0) {
    const chunks = []

    for (let i = 0; i < distributionList.value.length; i += CHUNK_SIZE) {
      chunks.push({
        display: `${i + 1}-${i + CHUNK_SIZE}`,
        address: distributionList.value.slice(i, i + CHUNK_SIZE),
        tx: '',
        status: txStatus.Pending
      })
    }
    batchList.tasks = chunks
  }

  const unfinishedTasks = batchList.tasks.filter(
    (x: any) => x.status != txStatus.Finished
  )

  for (const task of unfinishedTasks) {
    task.status = txStatus.Processing
    try {
      const result = await tokenStore.transferMultiToken(
        task.address.map((x: any) => ({
          address: x.address,
          amount: x.amount,
          denom: baseDenom.value
        }))
      )

      if (result.code != 0) {
        throw new Error(result.data)
      }
      task.tx = result.txHash
      task.status = txStatus.Finished
    } catch (e: any) {
      task.status = txStatus.Error
      $onError(e)
      break
    }
  }

  status.setIdle()
}

const ifErrorsAccured = computed(() => {
  return batchList.tasks.some((x: any) => x.status == txStatus.Error)
})

const handleDistribute = async () => {
  const { valid } = await validate()

  if (!valid || !userHaveEnoughtFund.value) {
    return
  }

  await handleBatchTransfer(false)
}

const handleRetryDistribution = async () => {
  await handleBatchTransfer(true)
}

const {
  value: distributionList,
  errorMessage: distributionListError,
  setState: setDistributionList
} = useField<any[]>('distributionList', 'required', { initialValue: [] })

const { value: baseDenom, errorMessage: baseDenomError } = useStringFieldCustom(
  {
    name: 'baseDenom',
    rule: 'required'
  }
)

const copyTx = (tx: string) => {
  copy(tx)
  success({ title: 'Tx copied' })
}

const baseDenomOptions = computed(() => [
  ...Object.keys(accountStore.balanceMap).map((item) => ({
    display:
      tokenStore.tokens.find((x) => x.denom === item)?.symbol || 'unknown',
    value: item
  }))
])

watch(baseDenom, () => {
  batchList.tasks = []
})

const FAQ = ref(false) // testowo, jak bedzie git to zrobie jako liste
</script>

<template>
  <div class="grid md:grid-cols-2 gap-8 md:gap-16">
    <div>
      <div class="flex justify-between">
        <label class="block text-xs font-semibold mb-2"> Token* </label>
        <p class="text-xs font-semibold text-gray-500 mb-1">
          Account Balance: {{ accountFormated }}
        </p>
      </div>
      <div class="mb-4">
        <AppSelectField
          v-model="baseDenom"
          label="Base Denom*"
          :options="baseDenomOptions"
          searchable
          :disabled="!status.isIdle()"
          :selected-class="'justify-between py-1 px-3 border border-gray-300'"
        >
          <template #selected-item="{ option }">
            <div v-if="option" class="p-2 bg-gray-200 cursor-defaul text-sm">
              <span v-if="option?.display?.length" class="font-semibold mr-2">
                {{ option?.display }}
              </span>
              <span class="font-semibold text-gray-600">
                {{ option?.value }}
              </span>
            </div>
          </template>
          <template #selected-option="{ option }">
            <span v-if="!option" class="text-gray-500"> Select </span>
            <span v-else>
              {{
                option?.display ||
                option?.value.slice(0, 12) + '...' + option?.value.slice(-5)
              }}
            </span>
          </template>

          <template #option="{ option }">
            <div>
              <span v-if="option?.display?.length" class="font-semibold mr-2">
                {{ option?.display }}
              </span>
              <span class="font-semibold text-gray-600">
                {{ option?.value }}
              </span>
            </div>
          </template>
        </AppSelectField>
        <p v-if="baseDenomError" class="text-red-500 text-xs mt-1">
          This field is required
        </p>
      </div>

      <div class="relative mb-4">
        <div class="mb-4">
          <div class="flex mb-2 items-center gap-1">
            <label class="block text-xs font-semibold"
              >Distribution List*
            </label>
            <CommonInfoTooltipWithElement>
              <template #content>
                Upload distribution list in .csv format. Ex:
                <code class="text-[10px]">
                  inj1qqq2lsaneur4m4l6h08dvue8nundccf20a3tmh, 50000<br />
                  inj1qqqqqhrac6w5qhcf42ku52gx348c3n0gzx3a7x, 40000
                </code>
              </template>
            </CommonInfoTooltipWithElement>
          </div>
          <div class="flex flex-column items-end gap-4">
            <AppButton
              :status="fileStatus"
              class="bg-gray-750 font-semibold"
              :disabled="!status.isIdle() || !baseDenom"
              @click="handleButtonClick"
            >
              Upload
            </AppButton>
            <p
              v-if="fileInput?.files?.length"
              class="mt-1 text-gray-500 text-sm"
            >
              {{ fileInput?.files[0]?.name }}
            </p>
          </div>
          <p v-if="distributionListError" class="text-red-500 text-xs mt-1">
            {{ distributionListError }}
          </p>
        </div>
        <div class="mb-4">
          <div
            class="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg border border-gray-300"
          >
            <div>
              <p class="text-xs font-semibold">Addresses</p>
              <p class="text-sm text-gray-600 mb-2 break-words">
                {{ distributionList.length }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold">Tokens</p>
              <p class="text-sm text-gray-600 mb-2 break-words">
                {{ distributionListSumAmount }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold">Transactions</p>
              <p class="text-sm text-gray-600 mb-2 break-words">
                {{ Math.ceil(distributionList.length / CHUNK_SIZE) }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold">Network Fee</p>
              <p class="text-sm text-gray-600 mb-2 break-words">
                ~
                {{
                  new BigNumberInWei(
                    distributionList.length * 0.000015
                  ).toFormat(3)
                }}
                INJ
              </p>
            </div>
          </div>
          <p v-if="!userHaveEnoughtFund" class="text-red-500 text-xs mt-1">
            You don't have enough funds.
          </p>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept=".txt,.csv,.xlsx,xls"
          style="display: none"
          @change="handleFileChange"
        />
      </div>

      <AppButton
        :status="status"
        class="bg-gray-750 font-semibold mb-8"
        @click="handleDistribute"
      >
        Distribute Token
      </AppButton>

      <div class="border-t border-solid border-gray-300">
        <div
          :class="{
            'border-b pb-2 border-solid border-gray-300': !FAQ
          }"
          class="py-2"
        >
          <div
            class="flex items-center justify-between cursor-pointer"
            :class="{
              'border-b pb-2 border-solid border-gray-300': FAQ
            }"
            @click="
              () => {
                FAQ = !FAQ
              }
            "
          >
            <p class="font-medium">How to prepare the airdrop file?</p>
            <BaseIcon
              name="arrow"
              class="transform w-4 h-4"
              :class="{
                '-rotate-90': !FAQ,
                'rotate-90': FAQ
              }"
            />
          </div>
          <div class="pt-2 text-sm" v-if="FAQ">
            <ol>
              <li class="mb-1">
                1. Download the genesis file from
                <NuxtLink class="text-blue-600 hover:underline" to="/snapshots">
                  Snapshots</NuxtLink
                >.
              </li>
              <li class="mb-1">
                2. Add the tokens you wish to airdrop for each address in the
                “Airdrop” column. You can set an amount based on the staked INJ
                through a filter.
              </li>
              <li class="mb-1">
                3. Add the decimals for your token next to “Token Decimals”.
              </li>
              <li>4. Upload the file and initiate the airdrop.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <div class="text-gray-600 max-w-2xl">
      <p class="text-xl mb-2">Distribution Status</p>
      <div class="pr-[14px] max-h-lg overflow-auto">
        <div class="grid grid-cols-12 w-full md:min-w-0 sticky top-0 bg-white">
          <span
            class="col-span-2 uppercase text-gray-700 whitespace-nowrap text-2xs"
          >
            Addresses
          </span>
          <span
            class="col-span-8 uppercase text-gray-700 text-end whitespace-nowrap text-2xs"
          >
            Tx
          </span>
          <span
            class="col-span-2 uppercase text-gray-700 text-end whitespace-nowrap text-2xs"
          >
            Status
          </span>
        </div>

        <div v-if="batchList.tasks.length">
          <div
            v-for="task in batchList.tasks"
            :key="`token-${task.tx}`"
            class="border-b border-gray-300 last-of-type:border-b-0 block w-full md:min-w-0 text-2xs"
          >
            <div class="grid grid-cols-12 items-center py-4 box-content">
              <div class="col-span-2 align-center justify-self-start">
                {{ task.display }}
              </div>
              <div class="col-span-8 align-center justify-self-end flex gap-1">
                <a
                  v-if="task.tx"
                  :href="`https://${
                    appStore.env === 'mainnet' ? '' : 'testnet.'
                  }explorer.injective.network/transaction/${task.tx}/`"
                  class="hover:text-blue-500"
                  target="_blank"
                >
                  {{ task.tx.slice(0, 10) }}...{{ task.tx.slice(-10) }}
                </a>
                <p v-else>-</p>
                <div v-if="task.tx">
                  <BaseIcon
                    name="copy-filled"
                    class="hover:text-gray-500 text-gray-600 h-4 w-4"
                    @click="() => copyTx(task.tx)"
                  />
                </div>
              </div>
              <div
                class="col-span-2 align-center justify-self-end"
                :class="{
                  'text-red-500': task.status === txStatus.Error,
                  'text-green-500': task.status === txStatus.Finished,
                  'text-orange-500':
                    task.status === txStatus.Processing ||
                    task.status === txStatus.Pending
                }"
              >
                {{ task.status }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!batchList.tasks.length"
          class="text-sm py-4 py-0 text-black text-center"
        >
          Start the distribution to see the progress.
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <AppButton
          v-if="ifErrorsAccured"
          :status="status"
          class="bg-gray-750 font-semibold mb-8"
          @click="handleRetryDistribution"
        >
          Retry Failures
        </AppButton>
      </div>
    </div>
  </div>
</template>
