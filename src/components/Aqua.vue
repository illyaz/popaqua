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
}

.aqua.not-pop {
  background-image: url("../assets/aqua2.png");
}

.aqua.not-pop.rage {
  background-image: url("../assets/aqua2_rage.png");
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
