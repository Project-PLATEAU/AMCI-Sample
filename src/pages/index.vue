<script lang="ts">
import Vue from 'vue'
import { eventStore } from '~/store'
import { SHOWED_MODAL_ABOUT } from '~/utils/consts'
import 'chartjs-plugin-deferred'

export default Vue.extend({
  data() {
    return {
      loadingProgress: 0,
      isDesktop: this.$device.isDesktop && !(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    }
  },

  computed: {
    ready(): boolean {
      return this.loadingProgress >= 100
    },
  },

  watch: {
    ready() {
      if (this.ready) {
        // @ts-ignore
        this.$refs.gl.start()
      }
    },
  },

  mounted() {
  },

  methods: {
    onProgress(progress: number) {
      this.loadingProgress = progress
    },
  },
})
</script>

<template lang="pug">
div(v-if="isDesktop")
    GLView(@load-progress="onProgress" ref="gl")
    transition(name="fade")
      .container(v-if="ready")
        Header
        Content
        ModalVenue
      .loading(v-else) Loading...
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.loading{
  position: fixed;
  top: 50%;
  width: 100%;
  text-align: center;
  animation:blink 100ms ease-in-out infinite alternate;
}

@keyframes blink{
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1.0;
  }
}
</style>
