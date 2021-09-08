<template>
  <span
    v-if="iso"
    class="ring-1 ring-black ring-opacity-10 rounded-sm shadow"
    :class="`flag:${iso.toUpperCase()}`"
    :title="title || iso"
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import "country-flag-icons/3x2/flags.css";

export default defineComponent({
  props: {
    iso: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
});
</script>