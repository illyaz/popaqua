<template>
  <span
    v-if="iso"
    class="ring-1 ring-black ring-opacity-10 rounded-sm shadow"
    :class="`flag:${iso.toUpperCase()}`"
    :title="title || iso"
  />
</template>
<script setup lang="ts">
import 'country-flag-icons/3x2/flags.css';

defineProps<{ iso: string, title?: string }>();
</script>