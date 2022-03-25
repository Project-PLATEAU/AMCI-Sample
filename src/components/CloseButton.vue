<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 40,
    },
  },

  computed: {
    cssVars() {
      return {
        '--size': `${this.size}px`,
      }
    },
  },
})
</script>

<template lang="pug">
button.close(:style="cssVars")
</template>

<style lang="scss" scoped>
.close {
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  appearance: none;

  &::before,
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1px;
    height: var(--size);
    content: '';
    background: $base;
    transform: rotate(45deg) translate(-50%, -50%);
    transform-origin: top left;
  }

  &::after {
    transform: rotate(-45deg) translate(-50%, -50%);
  }
}
</style>
