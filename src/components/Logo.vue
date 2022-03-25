<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    withTypography: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 121,
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
.logo(:style="cssVars")
  img(src="~/assets/images/logo_with_type.svg" v-if="withTypography")
  img(src="~/assets/images/logo.svg" v-else)
</template>

<style lang="scss" scoped>
.logo {
  width: var(--size);
  height: auto;
}
</style>
