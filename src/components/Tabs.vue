<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    tabSize: {
      type: Number,
      default: 3,
    },
  },

  computed: {
    cssVars() {
      return {
        '--tabSize': `${this.tabSize}`,
      }
    },
  },
})
</script>

<template lang="pug">
ul.tabs(:style="cssVars")
  slot
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  height: 40px;
  border: 1px solid $base;

  .tab-item {
    width: calc(100% / var(--tabSize));
  }
}
</style>
