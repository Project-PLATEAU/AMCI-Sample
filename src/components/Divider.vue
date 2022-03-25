<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    marginTop: {
      type: Number,
      default: 30,
    },
    marginBottom: {
      type: Number,
      default: 30,
    },
  },

  computed: {
    cssVars() {
      return {
        '--marginTop': `${this.marginTop}px`,
        '--marginBottom': `${this.marginBottom}px`,
      }
    },
  },
})
</script>

<template lang="pug">
.divider(:style="cssVars")
</template>

<style lang="scss" scoped>
.divider {
  margin-top: var(--marginTop);
  margin-bottom: var(--marginBottom);
  border-top: 1px solid $base;
}
</style>
