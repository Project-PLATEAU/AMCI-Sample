<script lang="ts">
import Vue from 'vue'
import PointGraph5 from '~/assets/images/graph_points_5.svg?inline'
import PointGraph6 from '~/assets/images/graph_points_6.svg?inline'
import PointGraph7 from '~/assets/images/graph_points_7.svg?inline'
import PointGraph8 from '~/assets/images/graph_points_8.svg?inline'
import PointGraph9 from '~/assets/images/graph_points_9.svg?inline'
import PointGraph10 from '~/assets/images/graph_points_10.svg?inline'
import PointGraph11 from '~/assets/images/graph_points_11.svg?inline'

export default Vue.extend({
  components: {
    PointGraph5,
    PointGraph6,
    PointGraph7,
    PointGraph8,
    PointGraph9,
    PointGraph10,
    PointGraph11,
  },

  props: {
    month: {
      type: Number,
      default: 5,
    },
  },

  mounted() {
    const polyline = document.querySelector<SVGPolylineElement>(`.month-${this.month} polyline.e`)
    if (polyline) {
      polyline.style.transition = 'none'
      polyline.style.strokeDasharray = `${polyline.getTotalLength()}`
      polyline.style.strokeDashoffset = `${polyline.getTotalLength()}`
      polyline.getBoundingClientRect()
      polyline.style.transition = 'stroke-dashoffset 1250ms linear'
      polyline.style.strokeDashoffset = `${0}`
    }

    const bars = Array.from(document.querySelectorAll<SVGRectElement>(`.month-${this.month} .c`))

    bars.sort((a, b) => {
      return a.x.baseVal.value - b.x.baseVal.value
    })
    bars.forEach((bar, index) => {
      bar.style.transform = 'scale(1, 0)'
      bar.style.animationDelay = `${index * (800 / bars.length)}ms`
    })

    const circles = Array.from(document.querySelectorAll<SVGPathElement>(`.month-${this.month} path.d`))
    circles.sort((a, b) => {
      const x1 = parseFloat(a.getAttribute('d')?.split(',')[0].slice(1)!)
      const x2 = parseFloat(b.getAttribute('d')?.split(',')[0].slice(1)!)
      return x1 - x2
    })
    circles.forEach((circle, index) => {
      circle.style.animationDelay = `${index * (1250 / circles.length)}ms`
    })
  },
})
</script>

<template lang="pug">
.point-graph(:class="`month-${month}`")
  PointGraph5(v-if="month === 5")
  PointGraph6(v-else-if="month === 6")
  PointGraph7(v-else-if="month === 7")
  PointGraph8(v-else-if="month === 8")
  PointGraph9(v-else-if="month === 9")
  PointGraph10(v-else-if="month === 10")
  PointGraph11(v-else-if="month === 11")
</template>

<style lang="scss" scoped>
.point-graph {
  position: relative;
  width: 525px;
  height: 359px;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    rect.c {
      transform-origin: 0 301px;
      animation: 1s scale cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }

    path.d {
      animation: 0.1s fade backwards;
    }

    @keyframes fade {
      to {
        fill-opacity: 1;
      }
      from {
        fill-opacity: 0;
      }
    }

    @keyframes scale {
      to {
        transform: scale(1, 1);
      }

      from {
        transform: scale(1, 0);
      }
    }
  }
}
</style>
