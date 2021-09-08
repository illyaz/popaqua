<script lang="ts">
import {defineComponent} from 'vue';
import {Howl} from 'howler';
import Aqua from './components/Aqua.vue';
import Leaderboard from './components/Leaderboard.vue';

import pop1w from './assets/pop1.webm?url'
import pop2w from './assets/pop2.webm?url'
import pop3w from './assets/pop3.webm?url'
import pop4w from './assets/pop4.webm?url'
import pop1m from './assets/pop1.mp3?url'
import pop2m from './assets/pop2.mp3?url'
import pop3m from './assets/pop3.mp3?url'
import pop4m from './assets/pop4.mp3?url'

const popAudios = [
  new Howl({src: [pop1w, pop1m], format: ['webm', 'mp3']}),
  new Howl({src: [pop2w, pop2m], format: ['webm', 'mp3']}),
  new Howl({src: [pop3w, pop3m], format: ['webm', 'mp3']}),
  new Howl({src: [pop4w, pop4m], format: ['webm', 'mp3']}),
];

export default defineComponent({
  components: {Leaderboard, Aqua},
  data() {
    return {
      popCount: 0,
      isPop: false,
      leaderboardOpened: false,
      currentSessionPopCount: 0,
      hmmm: 0,
      ok: false
    };
  },
  created() {
    const storagePop = localStorage.getItem('popCount');
    if (storagePop) this.popCount = parseInt(storagePop, 10);

    if (isNaN(this.popCount))
      this.popCount = 0

    const storageHmmm = localStorage.getItem('hmmm');
    if (storageHmmm) this.hmmm = parseInt(storageHmmm, 10)

    if (isNaN(this.hmmm))
      this.hmmm = 0
  },
  mounted() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    (this.$refs.clickRegion as HTMLDivElement).addEventListener('touchstart', this.onTouchStart);
    (this.$refs.clickRegion as HTMLDivElement).addEventListener('touchend', this.onTouchEnd);
    window.setInterval(() => {
      this.sendScore().catch(console.log)
    }, 15000);
  },
  methods: {
    pop() {
      this.popCount += 1;
      this.currentSessionPopCount += 1;
      (this.$refs.lb as InstanceType<typeof Leaderboard>).addedPop++;
      localStorage.setItem('popCount', this.popCount.toString());
    },
    bak(pop: boolean) {
      this.isPop = pop;
      if (pop) popAudios[Math.floor(Math.random() * popAudios.length)].play();
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.repeat || e.isComposing) return;
      this.bak(true);
      this.pop();
    },
    onKeyUp(e: KeyboardEvent) {
      if (e.repeat || e.isComposing) return;

      this.bak(false);
      setTimeout(() => this.isPop = false, 25);
    },
    onTouchStart(e: TouchEvent) {
      e.preventDefault();
      this.pop();
      this.bak(true);
    },
    onTouchEnd(e: TouchEvent) {
      e.preventDefault();
      this.bak(false);
      setTimeout(() => this.isPop = false, 25);
    },
    async sendScore() {

      if (this.currentSessionPopCount > 0) {
        if(25 > this.hmmm) {
          await this.$recaptchaLoaded();
          const token = await this.$recaptcha('pop');

          await fetch(import.meta.env.VITE_LEADERBOARD_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token,
              pop: this.currentSessionPopCount,
              hmmm: this.hmmm
            })
          });
        }

      }

      if (this.currentSessionPopCount > 1000 && this.hmmm < 25)
        localStorage.setItem("hmmm", (this.hmmm++).toString());
      else if (this.hmmm > 0)
        localStorage.setItem("hmmm", (this.hmmm--).toString());

      this.currentSessionPopCount = 0;
    }
  },
});
</script>

<template>
  <div id="app">
    <div
      ref="clickRegion"
      class="clickRegion"
      @mousedown.prevent="bak(true);pop();"
      @mouseup.prevent="bak(false)"
      @click="leaderboardOpened=false"
    />
    <p
      class="image-credit"
    >
      Art by <a
        href="https://twitter.com/Nekotaririn_EX?s=20"
        target="_blank"
      >@Nekotaririn_EX</a>
    </p>
    <Aqua
      class="max-w-sm"
      style="margin-bottom: 47px;"
      :pop="isPop"
      :count="popCount"
    />
    <Leaderboard
      ref="lb"
      :count="popCount"
    />
  </div>
</template>

<style scoped>
#app {
  @apply flex flex-col items-center h-full;
  height: 100%;
}

.image-credit {
  @apply text-sm font-light right-0 top-0 m-2 mr-3;
  position: absolute;
}

.image-credit a {
  @apply font-normal underline hover:text-pink-700;
}

.clickRegion {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
}
</style>

<style>
html {
  padding: 0;
  margin: 0;
  background: #e2a0a0;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
::-webkit-scrollbar{
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb{
  background: radial-gradient(circle, #FAB4B4 18%,#F0BBBB 77%);
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:hover{
  background: #CC7E9D;
}
::-webkit-scrollbar-track{
  background: #FCE8F0;
  border-radius: 8px;
  box-shadow: inset 0px 0px 0px 0px ;
}
</style>
