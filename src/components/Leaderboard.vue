<template>
  <div class="leaderboard-container">
    <div
      class="leaderboard"
      :class="{opened: open}"
    >
      <div>
        <div
          class="header"
          @click.prevent="open = !open"
        >
          <div class="flex space-x-1 text-xs">
            <span class="text-base">🏆</span>
            <div
              v-if="!open && !isLoading"
              class="flex items-center space-x-1 text-xs"
            >
              <span class="border-l h-5" />
              <span class="ml-1">#1 </span>
              <Flag
                v-if="winner"
                :iso="winner.code"
              />
              <span class=" text-xs">{{ formatNumber(winner?.pop ?? 0, 1) }}</span>
            </div>
          </div>
          <div>
            <span class="font-light none">Leaderboard</span>
          </div>
          <div>
            <div class="flex items-center flex-row space-x-1">
              <Flag
                :iso="currentCountry"
                class="mr-1"
              />
              <transition :key="currentCountryScore + addedPop">
                <span
                  v-if="!open && !isLoading"
                  class=" text-sm font-bold"
                >{{ (currentCountryScore + addedPop).toLocaleString('en') }}</span>
              </transition>
              <span class="border-l h-5" />
              <span
                class="transform"
                :class="{'rotate-180':open}"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto border-t-2 divide-y">
        <div class="divide-y ">
          <div v-if="isError">
            <p class="text-center">
              <exclamation-icon class="error-icon" /> {{ isError }}
            </p>
          </div>
          <div
            v-if="isLoading"
            class="flex items-center justify-center "
          >
            <svg
              class="animate-spin h-5 w-5 m-3 mr-2 text-pink-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading ...</span>
          </div>
          <ul
            v-for="(n, i) in sortedLeaderboard.filter(x=>x.pop)"
            v-else
            :key="n.code"
            class="p-2 pt-1 pb-1"
          >
            <li
              class="text-base font-light flex justify-between items-center"
            >
              <div class="flex items-center">
                <div
                  class="text-center"
                  style="min-width: 1.2rem"
                >
                  <span v-if="i === 0">🌍</span>
                  <span v-else-if="i === 1">🥇</span>
                  <span v-else-if="i === 2">🥈</span>
                  <span v-else-if="i === 3">🥉</span>
                  <span v-else>{{ i }}</span>
                </div>
                <div class="pl-2 flex items-center">
                  <Flag
                    v-if="i !== 0"
                    :iso="n.code"
                  />
                  <span
                    :class="{'pl-3': i !== 0,'font-bold': currentCountry === n.code}"
                  >{{ n.name }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <span
                  v-if="n.pps"
                  class="font-bold text-green-500 pr-2"
                  style="font-size: 0.7rem"
                >{{ formatNumber(n.pps, 1) }} PPS</span>
                <AnimatedNumber
                  :value="n.pop"
                  :duration="10000"
                />
              </div>
            </li>
          </ul>
        </div>
        <div class="footer text-center text-sm font-light pt-4 pb-4 ">
          <a
            class="text-pink-500 font-bold text-base block"
            href="https://youtu.be/HUWyLcPf1vo?t=1766"
          >
            HERE HER POP!
          </a>
          Made with <span class="text-red-400">❤</span> by Illyaz <span class="text-red-400">❤</span> king.ppap
          <div>
            This site is protected by reCAPTCHA and the Google <a
              class="underline hover:text-pink-700"
              href="https://policies.google.com/privacy"
              target="_blank"
            >Privacy Policy</a> and <a
              class="underline hover:text-pink-700"
              href="https://policies.google.com/terms"
              target="_blank"
            >Terms of Service</a> apply.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AnimatedNumber from "./AnimatedNumber.vue";
import Flag from "./Flag.vue";
import { ExclamationIcon } from '@heroicons/vue/solid'

interface LeaderboardEntry {
  code: string;
  name: string;
  pop: number;
  pps?: number;
}

export default defineComponent({
  components: {
    AnimatedNumber,
    Flag,
    ExclamationIcon,
  },
  props: {
    count: {type: Number, required: true}
  },
  emits: ['update:open'],
  data() {
    return {
      isError: '',
      open: false,
      currentCountry: '',
      isLoading: true,
      worldPop: 0,
      leaderboard: [] as (LeaderboardEntry[]),
      currentCountryScore: 0,
      addedPop: 0,
      lastLoadedLeaderboard: 0
    }
  },
  computed: {
    sortedLeaderboard() {
      return [...this.leaderboard].sort((a, b) => b.pop - a.pop);
    },
    winner() {
      return this.sortedLeaderboard[1];
    },
  },
  mounted() {
    this.loadLeaderboard();
  },
  methods: {
    async loadLeaderboard() {
      try {
        if (!this.currentCountry)
          this.currentCountry = await this.getCountryAsync();

        const data = await this.getLeaderboardAsync()
        if (this.leaderboard.length == 0)
          this.leaderboard = data
        else {
          for (const newEntry of data) {
            const oldEntryIndex = this.leaderboard.findIndex(x => x.code == newEntry.code)
            const oldEntry = this.leaderboard[oldEntryIndex];
            if (oldEntry) {
              oldEntry.pps = (newEntry.pop - oldEntry.pop) / ((Date.now() - this.lastLoadedLeaderboard) / 1000);
              oldEntry.pop = newEntry.pop;
            } else {
              this.leaderboard.push(newEntry)
            }
          }
        }

        const countryScore = data.find(x => x.code == this.currentCountry)?.pop ?? 0;
        if (countryScore > this.currentCountryScore)
          this.currentCountryScore = countryScore
        this.addedPop = 0;

        if (this.isLoading) {
          this.isLoading = false;
        }
        this.isError = '';

        this.lastLoadedLeaderboard = Date.now();
        setTimeout(this.loadLeaderboard, 10000)
      } catch(error) {
        console.error("Can not load leaderboard", error)
        this.isError = "Can not load leaderboard";
        setTimeout(this.loadLeaderboard, 3000)
      }
    },
    formatNumber: (num: number, digits = 0) => {
      const lookup = [
        {value: 1, symbol: ""},
        {value: 1e3, symbol: "k"},
        {value: 1e6, symbol: "M"},
        {value: 1e9, symbol: "G"},
        {value: 1e12, symbol: "T"},
        {value: 1e15, symbol: "P"},
        {value: 1e18, symbol: "E"}
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      const item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
      });
      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + ' ' + item.symbol : "0";
    },
    getCountryAsync: () => fetch(`${import.meta.env.VITE_LEADERBOARD_URL}/cdn-cgi/trace`)
        .then(d => d.text())
        .then(t => {
          const a = t.match(/loc=([A-Z]{2})/);
          if (!a)
            throw new Error("can't get location");
          return a[1];
        }),
    getLeaderboardAsync: () => fetch(import.meta.env.VITE_LEADERBOARD_URL)
        .then(d => d.json())
        .then((r: { [key: string]: number }) => {
          const result = [{code: '--', name: 'Worldwide', pop: 0}] as LeaderboardEntry[];

          const displayNames = new Intl.DisplayNames(['en'], {type: 'region'});
          for (const key in r) {
            if (key !== 'XX') {
              result[0].pop += r[key]
              result.push({
                code: key,
                name: displayNames.of(key),
                pop: r[key]
              });
            }
          }
          return result;
        })
  }
});
</script>

<style scoped>

.leaderboard-container {
  @apply w-full max-w-4xl ;
  position: absolute;
  bottom: 0;
  margin: 0 auto;
}

.leaderboard {
  @apply bg-white rounded-t-md flex flex-col ring-0 duration-300 ease-in-out;
  height: 48px;
  transition-property: height, box-shadow;
}

.leaderboard:hover {
  @apply ring-2 ring-pink-300;
}

.leaderboard.opened {
  height: 80vh;
}

.header {
  @apply flex justify-between items-center p-2 my-1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.footer {
  background: white;
}

.error-icon {
  @apply h-10 w-10 text-red-500;
  display: inline;
}
</style>
