<script setup lang="ts">
import type { Entries } from 'type-fest'

enum Section {
  Token = 'TOKEN',
  Markets = 'MARKETS'
  // Liquidity = 'LIQUIDITY'
}

type OptionContent = { title: string; description: string }
const options: Record<Section, OptionContent> = {
  [Section.Token]: {
    title: 'Launch Token',
    description:
      'Launch your own token on Injective with full customization and no coding.'
  },
  [Section.Markets]: {
    title: 'Launch Market',
    description: 'Create a trading pair for your token on Injective’s orderbook'
  }
  // [Section.Liquidity]: {
  //   title: 'Provide Liquidity',
  //   description:
  //     'Provide liquidity for the trading pair through advanced strategies.'
  // }
}

const activeSection = ref(Section.Token)

const handleChangeSection = (key: Section) => {
  activeSection.value = key
}
</script>

<template>
  <div class="mb-4 lg:w-1/2 text-center mx-auto">
    <h2
      class="text-gray-900 font-bold text-[36px] leading-[58px] sm:text-5xl sm:leading-[60px] 3xl:leading-[72px] 3xl:text-[48px] 4xl:leading-[77px] 4xl:text-[48px]"
    >
      How to Launch a Token?
    </h2>
  </div>
  <div
    class="grid md:grid-cols-2 gap-8 md:gap-16 items-center max-w-6xl mx-auto mb-16 min-h-[500px]"
  >
    <div>
      <div
        v-for="[key, value] in Object.entries(options) as unknown as Entries<typeof options>"
        class="hover:shadow-helix transition cursor-pointer rounded-xl text-gray-800 p-6 mb-4"
        :class="{
          'shadow-helix': activeSection == key
        }"
        @click="handleChangeSection(key)"
      >
        <h4 class="font-semibold text-lg">
          {{ value.title }}
        </h4>
        <p>
          {{ value.description }}
        </p>
      </div>
    </div>
    <div
      v-if="activeSection === Section.Markets"
      class="flex flex-col justify-center h-full"
    >
      <img
        src="https://blog.injective.com/content/images/2022/11/connected-l1s.png"
      />
    </div>
    <div
      v-if="activeSection === Section.Token"
      class="grid grid-cols-4 grid-rows-2 gap-4 h-96 text-black"
    >
      <div
        class="rounded-xl shadow-helix flex p-4 sm:p-8 items-center row-start-2 row-end-3 col-start-1 col-end-3 relative overflow-hidden"
      >
        <div class="w-4 h-full left-0 absolute bg-blue-550 blur-3xl"></div>

        <div class="flex flex-col justify-center relative">
          <p class="font-semibold text-xl">Step 2</p>
          <p class="text-xl leading-7">
            Choose the initial supply of your token.
          </p>
        </div>
      </div>
      <div
        class="rounded-xl shadow-helix p-4 sm:p-8 flex items-center col-start-2 col-end-4 relative overflow-hidden"
      >
        <div class="w-4 h-full left-0 absolute bg-blue-550 blur-3xl"></div>
        <div class="flex flex-col justify-center relative">
          <p class="font-semibold text-xl">Step 1</p>
          <p class="text-xl leading-7">
            Choose the name, symbol and logo for your token.
          </p>
        </div>
      </div>

      <div
        class="rounded-xl shadow-helix p-4 sm:p-8 flex items-center row-start-2 row-end-3 col-start-3 col-end-5 relative overflow-hidden"
      >
        <div class="w-4 h-full left-0 absolute bg-blue-550 blur-3xl"></div>

        <div class="flex flex-col justify-end relative">
          <p class="font-semibold text-xl">Step 3</p>
          <p class="text-xl leading-7">Launch your token on Injective.</p>
        </div>
      </div>
    </div>
    <!-- <div
      v-if="activeSection === Section.Liquidity"
      class="grid grid-cols-5 gap-4 py-12"
    >
      <div
        class="rounded-xl shadow-helix px-8 flex items-center col-start-1 col-end-4 h-[150px]"
      >
        <svg
          viewBox="0 500 2000 1000"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g
            id="Primary-Logo备份"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="logo"
              transform="translate(188.000000, 849.000000)"
              fill-rule="nonzero"
            >
              <path
                id="路径"
                d="M476.973627,302.99018 L357.243843,302.99018 L250,121.369925 L318.417019,5.97123395 C319.499938,4.15181087 321.038823,2.64445843 322.883161,1.59750254 C324.727499,0.550549408 326.813653,0 328.936329,0 C331.059006,0 333.144607,0.550549408 334.988945,1.59750254 C336.833283,2.64445843 338.372721,4.15181087 339.45564,5.97123395 L496.130282,271.029824 C498.036595,274.315968 499.027104,278.050448 499,281.84614 C498.972321,285.641281 497.928137,289.360872 495.974788,292.619443 C494.021993,295.878565 491.230308,298.558104 487.889694,300.381228 C484.54908,302.204351 480.780167,303.105435 476.973627,302.99018 Z"
                fill="#02C57F"
              ></path>
              <path
                id="路径"
                d="M247,121.372034 L140.458265,302.9965 L21.6069391,302.9965 C17.8492501,303.064882 14.1408331,302.130141 10.860923,300.287679 C7.581013,298.445217 4.84722547,295.761764 2.93902652,292.510848 C1.03082209,289.259932 0.0166500697,285.559016 0,281.785858 C-0.0162435099,278.012699 0.965582026,274.30296 2.84537131,271.0355 L158.370855,5.9714037 C159.44583,4.15189433 160.973427,2.64451152 162.804235,1.59753454 C164.635043,0.550560308 166.705895,0 168.813,0 C170.920105,0 172.990407,0.550560308 174.821215,1.59753454 C176.652024,2.64451152 178.180169,4.15189433 179.254595,5.9714037 L247,121.372034 Z"
                fill="#70E766"
              ></path>
              <polygon
                id="路径"
                fill="#02C57F"
                points="249.542482 230 298 303 201 303"
              ></polygon>
              <path
                id="路径"
                d="M974.162251,81.120171 C960.829527,73.0084226 945.491633,68.8119047 929.904476,69.006471 C914.921087,68.8258023 900.153724,72.6192899 887.097958,80.0033603 C874.474245,87.02109 863.772615,97.054042 855.940263,109.214438 C847.986049,96.8572521 837.073932,86.7014453 824.195418,79.6764888 C811.316904,72.6515323 796.88743,68.9825672 782.23085,69.006471 C770.803592,69.0520551 759.498195,71.3946338 748.984897,75.8952311 C738.471598,80.3952725 728.966424,86.9627201 721.023289,95.2101091 L721.023289,75.2781779 L667,75.2781779 L667,298.656451 L721.27809,298.656451 L721.27809,172.018227 C721.222698,163.696903 723.382965,155.512331 727.526246,148.305594 C731.702762,141.222824 737.590874,135.31301 744.647746,131.122607 C751.726774,126.675377 759.92471,124.350587 768.277742,124.421187 C776.647391,124.319456 784.88964,126.549743 792.073912,130.864668 C799.208332,134.953896 805.124139,140.887614 809.195411,148.047655 C813.405162,155.446735 815.565429,163.84255 815.443568,172.361776 L815.443568,299 L869.721657,299 L869.721657,172.018227 C869.57764,163.472874 871.798837,155.055378 876.141527,147.704106 C880.290348,140.602991 886.189538,134.687063 893.263027,130.521119 C900.447299,126.206194 908.689548,123.975908 917.059197,124.077638 C925.423307,123.947557 933.632321,126.27735 940.689193,130.779059 C947.801456,134.894415 953.711725,140.822017 957.810693,147.962046 C962.153383,155.097627 964.407815,163.314441 964.319189,171.674679 L964.319189,298.312903 L1017.99351,298.312903 L1017.99351,157.498576 C1018.18738,141.862669 1014.03302,126.482478 1006.0068,113.080193 C998.307388,99.8546855 987.339879,88.8461222 974.162251,81.120171 Z"
                fill="#000"
              ></path>
              <polygon
                id="路径"
                fill="#000"
                points="1115 76 1061 76 1061 298 1115 298"
              ></polygon>
              <polygon
                id="路径"
                fill="#000"
                points="1243.65057 9 1189.03106 9 1189.03106 78.2742613 1156 78.2742613 1156 132.182275 1189.03106 132.182275 1189.03106 299 1243.65057 299 1243.65057 132.182275 1287 132.182275 1287 78.2742613 1243.65057 78.2742613"
              ></polygon>
              <path
                id="形状"
                d="M1607.86134,127.439463 C1598.37092,110.010428 1584.5335,95.3196339 1567.69298,84.7872574 C1550.99627,74.2758551 1531.61723,68.7960608 1511.87871,69.0058032 L1415.54766,69.0058032 C1401.82637,69.3491182 1388.31525,72.4234992 1375.79962,78.0479052 C1362.3604,84.1370561 1350.27615,92.8369471 1340.24374,103.639229 C1327.96593,116.431855 1318.69673,131.789961 1313.09982,148.600256 C1307.50844,165.411104 1305.7276,183.253 1307.89558,200.833823 C1310.06355,218.414645 1316.12503,235.294487 1325.63757,250.249115 C1335.15011,265.203743 1347.87589,277.860036 1362.89133,287.299545 C1378.70316,297.173993 1396.89866,302.597488 1415.54766,302.997776 L1511.87871,302.997776 C1526.75588,303.09535 1541.4782,299.981228 1555.0391,293.867791 C1568.34559,287.901174 1580.33581,279.379564 1590.34057,268.788681 C1611.53916,246.562065 1623.24732,216.982326 1622.99292,186.299231 C1623.21967,165.693704 1617.99883,145.392303 1607.86134,127.439463 Z M1561.19459,217.43548 C1556.52681,226.642064 1549.58598,234.510161 1541.02469,240.296841 C1532.4081,246.042125 1522.23743,249.01881 1511.87871,248.827283 L1415.54766,248.827283 C1406.57158,248.187569 1397.92181,245.248968 1390.41686,240.296841 C1381.76155,234.599577 1374.68245,226.82752 1369.81557,217.691034 C1364.55049,207.950711 1361.87371,197.025344 1362.03962,185.958124 C1361.92901,175.091264 1364.51178,164.366256 1369.56117,154.736323 C1374.32297,145.444186 1381.34676,137.494952 1389.991,131.619407 C1397.60104,126.500038 1406.4665,123.550399 1415.63062,123.088966 L1511.96167,123.088966 C1522.09363,123.014452 1532.0099,125.986722 1540.42186,131.619407 C1549.20437,137.303424 1556.33877,145.185872 1561.11163,154.480769 C1566.16655,164.129468 1568.80462,174.856684 1568.80462,185.744518 C1568.80462,196.632905 1566.16655,207.359569 1561.11163,217.00882 L1561.19459,217.43548 Z"
                fill="#000"
              ></path>
            </g>
          </g>
        </svg>
      </div>
      <div
        class="rounded-xl shadow-helix px-8 flex items-center row-start-2 row-end-3 col-start-3 col-end-6 h-[150px]"
      >
        <img src="/liquidity-providers/elixir-black.png" />
      </div>
    </div> -->
  </div>
</template>
