<template>
  <div
    class="aqua"
    :class="{'pop': pop, 'not-pop': !pop, 'rage': rage}"
  >
    <transition
      name="count-anim"
      mode="out-in"
    >
      <div
        :key="count"
        class="count"
        :class="`rot-${counterRotation}`"
      >
        {{ count.toLocaleString('en') }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';

const props = defineProps<{
  pop: boolean,
  rage: boolean,
  count: number
}>();
const counterRotation = ref('c');

watch(() => props.count, () => {
  const rotations = [1, 2, 3, 4, 5, 6, 7, 8];
  counterRotation.value = rotations[Math.floor(Math.random() * rotations.length)].toString();
});
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>

.aqua {
  @apply flex-grow w-full max-w-screen-sm h-0 bg-bottom bg-contain bg-no-repeat;
  touch-action: manipulation;
}

.count {
  @apply font-bold text-center text-white break-words;
  font-size: 80px;
}

.aqua.pop {
  background-image: url("../assets/aqua1.png");
}

.aqua.pop.rage {
  background-image: url("../assets/aqua1_rage.png");
  animation: shake 0.3s;
  animation-iteration-count: infinite;
}

.aqua.not-pop {
  background-image: url("../assets/aqua2.png");
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.count-anim-leave {
  display: none;
}

.count-anim-enter-active {
  transition: all 80ms ease-in-out;
}

.count-anim-enter-to.rot-1 {
  transform: scale(1.2) rotate(-10deg);
}

.count-anim-enter-to.rot-2 {
  transform: scale(1.2) rotate(10deg);

}

.count-anim-enter-to.rot-3 {
  transform: scale(1.3) rotate(-10deg);
}

.count-anim-enter-to.rot-4 {
  transform: scale(1.3) rotate(-10deg);
}

.count-anim-enter-to.rot-5 {
  transform: scale(1.2) rotate(-5deg);
}

.count-anim-enter-to.rot-6 {
  transform: scale(1.2) rotate(-5deg);
}

.count-anim-enter-to.rot-7 {
  transform: scale(1.3) rotate(-5deg);
}

.count-anim-enter-to.rot-8 {
  transform: scale(1.3) rotate(-5deg);
}

.count-anim-enter-to {
  transform: scale(1);
}
</style>
