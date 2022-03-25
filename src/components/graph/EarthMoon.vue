<script lang="ts">
import Vue from 'vue'
import EarthToMoon from '~/assets/images/earth_to_moon.svg?inline'
import MoonToEarth from '~/assets/images/moon_to_earth.svg?inline'

export default Vue.extend({
  components: {
    EarthToMoon,
    MoonToEarth,
  },

  mounted() {
    const arrowRight = this.$refs.arrowRight as HTMLDivElement
    const arrowLeft = this.$refs.arrowLeft as HTMLDivElement

    const data = this.$amciData.totalWalksDistance
    setTimeout(() => {
      if (data <= 0.5) {
        arrowRight.style.width = `${data * 100}%`
        arrowLeft.style.width = '0%'
      } else {
        arrowRight.style.width = '100%'
        arrowLeft.style.width = `${data * 100}%`
      }
    }, 100)
  },
})
</script>

<template lang="pug">
.earth-moon
  img(src="~/assets/images/earth_moon.png" srcset="~/assets/images/earth_moon.png 1x, ~/assets/images/earth_moon@2x.png 2x")
  .earth-to-moon
    EarthToMoon
    .arrow-right(ref="arrowRight")
  .moon-to-earth
    MoonToEarth
    .arrow-left(ref="arrowLeft")
</template>

<style lang="scss" scoped>
.earth-moon {
  position: relative;
  width: 462px;
  height: 101px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
  }

  .earth-to-moon {
    position: absolute;
    top: 19px;
    left: 122px;
    width: 250px;
    height: 27px;

    .arrow-right {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 0;
      height: 100%;
      clip-path: url(#earth-to-moon);
      background: $magenta;
      transition: width 1s;
    }
  }

  .moon-to-earth {
    position: absolute;
    top: 55px;
    left: 122px;
    width: 250px;
    height: 27px;

    .arrow-left {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      width: 0;
      height: 100%;
      /* clip-path: url(#moon-to-earth); */
      clip-path: url(#earth-to-moon);
      background: $magenta;
      transition: width 1s 1s;
      transform: scaleX(-1);
    }
  }
}
</style>
