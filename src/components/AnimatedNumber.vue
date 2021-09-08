<template>
  <span>{{ Number(animatedValue).toLocaleString('en') }}</span>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import anime from "animejs";

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 15000
    }
  },
  data() {
    return {animatedValue: 0, isFirstAnimate: true};
  },
  watch: {
    value(value) {
      this.animateValue(value);
    },
  },
  mounted() {
    this.animateValue(this.value);
  },
  methods: {
    animateValue(value: number) {
      if (this.isFirstAnimate) {
        this.animatedValue = value;
        this.isFirstAnimate = false;
      } else
        anime({
          targets: this,
          animatedValue: this.value,
          duration: this.duration,
          delay: 0,
          easing: 'linear',
          round: 1
        })
    }
  }
})
</script>
<style scoped>

</style>