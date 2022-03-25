<script lang="ts">
import Vue from 'vue'
import Co2GraphImage from '~/assets/images/graph_co2.svg?inline'

export default Vue.extend({
  components: {
    Co2GraphImage,
  },

  mounted() {
    const currentValue = document.querySelector('#current-value') as SVGTextElement
    currentValue.textContent = `${Math.round(this.$amciData.co2reducations).toLocaleString()}g`
  },
})
</script>

<template lang="pug">
.co2-graph
  Co2GraphImage
</template>

<style lang="scss" scoped>
.co2-graph {
  position: relative;
  width: 525px;
  height: 286px;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    $path-animation-duration: 1.2s;
    $fade-animation-duration: 0.3s;
    $animation-delay: 200ms;
    $ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);

    path.e {
      stroke-dasharray: 506.93;
      animation: $path-animation-duration $ease-out-quart line $animation-delay backwards;
    }

    .p1 {
      animation: $fade-animation-duration fade math.div($path-animation-duration * 0, 3) + $animation-delay backwards;
    }

    .p2 {
      animation: $fade-animation-duration fade math.div($path-animation-duration * 1, 3) + $animation-delay backwards;
    }

    .p3 {
      animation: $fade-animation-duration fade math.div($path-animation-duration * 2, 3) + $animation-delay backwards;
    }

    .text {
      letter-spacing: 0.05em;
    }

    @keyframes fade {
      to {
        fill-opacity: 1;
      }
      from {
        fill-opacity: 0;
      }
    }

    @keyframes line {
      to {
        stroke-dashoffset: 0;
      }
      from {
        stroke-dashoffset: 506.93;
      }
    }
  }
}
</style>
