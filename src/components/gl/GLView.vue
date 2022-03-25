<script>
import Vue from 'vue'
import MainGL from './js/Main'
import { eventStore } from '~/store'
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))

const Component = Vue.extend({
  components: {},

  data() {
    return {
      per: 0.0,
      countPer: 0,
      countPerInt: 0,
      reqId: null,
      isLoaded: false,
      showLogo: true,
      debug: false,
      debugText: ''
    }
  },

  computed: {
    currentContent() {
      return eventStore.currentContent
    },

    currentAreaActivityTab() {
      return eventStore.currentAreaActivityTab
    },

    currentVenue() {
      return eventStore.currentVenue
    },

    currentSDGsActionTab() {
      return eventStore.currentSDGsActionsTab
    },
  },

  watch: {
    currentContent(contentType) {
      this.changeScene(contentType)
    },

    currentVenue(venue) {
      this.changeScene(venue)
    },

    currentAreaActivityTab(areaActivityTab) {
      this.changeScene(areaActivityTab)
    },

    currentSDGsActionTab(sdgsActionTab) {
      this.changeScene(sdgsActionTab)
    },
  },

  created() {
    this.reqId = requestAnimationFrame(this.loop)
    if(this.$route.query.debug){
      this.debug = true
    }
  },

  mounted() {
    this.mainGL = new MainGL({
      $canvas: this.$refs.canvas,
      vueContainer: this,
      debug: this.debug,
      vue: this
    })

    this.mainGL.addLoaderProgress((loaded, total) => {
      this.per = loaded / total
    })

    this.mainGL.addLoaderComplete(() => {
      // this.start()
    })

    this.mainGL.init()
  },

  destroyed() {
    this.mainGL.removeLoaderProgress()
    this.mainGL.removeLoaderComplete()
    this.mainGL.destroy()
  },

  methods: {
    loop() {
      this.countPer += (this.per - this.countPer) * 0.03
      this.countPerInt = Math.round(this.countPer * 100)

      this.$emit('load-progress', this.countPerInt)

      if (this.countPerInt >= 100) {
        cancelAnimationFrame(this.reqId)
        this.$emit('load-complete', '')
        // this.start()
      } else {
        this.reqId = requestAnimationFrame(this.loop)
      }
    },

    async start() {
      // start
      this.mainGL.start()

      await sleep(1000)
      this.isLoaded = true

      // await sleep(5000)
      // this.showLogo = false
    },

    getPerInt(){
      return this.this.countPerInt
    },

    changeScene(value) {
      const type = Object.prototype.toString.call(value)
      if (type === '[object Object]') {
        // Venue
        if (Object.keys(value).length > 0) {
          // some venue selected
          this.showLogo = false
          this.mainGL.changeScene('Venues', value.id)
        } else {
          // venue not selected (default)
          this.showLogo = false
          this.mainGL.changeScene('Venues', '')
        }
      } else if (type === '[object String]') {
        // Area
        if (['Co2Reducations', 'Walks', 'Points'].includes(value)) {
          this.showLogo = false
          this.mainGL.changeScene('AreaActivity', value)
        }
        // SDGs
        else if (['All', 'Otemachi', 'Marunouchi', 'Yurakucho'].includes(value)) {
          this.showLogo = false
          this.mainGL.changeScene('SDGsActions', value)
        }
        // Home
        else if (value === 'Home') {
          this.showLogo = true
          this.mainGL.changeScene(null, '')
        }
      }
    },

    setShop(venue){
      // console.log('setShop', venue, eventStore)
      eventStore.setVenue({})
      setTimeout(() => {
        eventStore.setVenue(venue)
        // eventStore.setCurrentAct(act)
      })
    },

    setDebug(text){
      this.debugText = text
    },

    playSound(){
    }

  },
})

export default Component
</script>

<template>
  <div id="gl_container">

    <span class="hline" v-if="debug"></span>
    <span class="vline" v-if="debug"></span>
    <div class="debug" v-if="debug" v-html="debugText"></div>

    <!-- <transition name="fade" mode="out-in" appear>
      <div v-if="!isLoaded" class="loader">
        <div class="ui">
          <p class="text">{{ countPerInt }}%</p>
        </div>
      </div>
    </transition> -->

    <transition name="scale-fade" mode="out-in" appear>
      <div v-if="isLoaded && showLogo" class="title">
        <img src="@/assets/images/logo_with_type.svg" alt="" />
      </div>
    </transition>

    <div id="canvas_container" class="canvas_container home" :class="{ show: isLoaded }">
      <canvas ref="canvas" class="canvas"></canvas>
      <canvas id="texture" class="texture_canvas"></canvas>
    </div>
  </div>
</template>

<style lang="scss">
@keyframes wave {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

/* color */
$purple: #463c64;
$pink: #ef5285;
$green: #00bebe;
$yellow: #ebf000;

/* ease */
$easeIn-out-cubic: 0.645, 0.045, 0.355, 1;
$easeIn-out-circ: 0.785, 0.135, 0.15, 0.86;
$easeIn-out-expo: 1, 0, 0, 1;
$easeIn-out-back: 0.68, -0.55, 0.265, 1.55;

#gl_container {
  font-size: 0;

  /* fade */
  .fade-enter,
  .fade-enter-active,
  .fade-enter-to {
    transition: opacity 1200ms ease-in-out 0ms;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
  }
  .fade-enter-to {
    opacity: 1;
  }

  .fade-leave,
  .fade-leave-active,
  .fade-leave-to {
    transition: opacity 600ms ease-in-out 0ms;
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-leave-active {
  }
  .fade-leave-to {
    opacity: 0;
  }

  /* scale-fade */
  .scale-fade-enter,
  .scale-fade-enter-active,
  .scale-fade-enter-to {
    transition: opacity 600ms ease-in-out 0ms, transform 600ms cubic-bezier(0.785, 0.135, 0.15, 0.86) 0ms;
  }
  .scale-fade-enter {
    opacity: 0;
    transform: scale(1.05);
  }
  .scale-fade-enter-active {
  }
  .scale-fade-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  .scale-fade-leave,
  .scale-fade-leave-active,
  .scale-fade-leave-to {
    transition: opacity 600ms ease-in-out 0ms, transform 600ms cubic-bezier(0.785, 0.135, 0.15, 0.86) 0ms;
  }
  .scale-fade-leave {
    opacity: 1;
    transform: scale(1);
  }
  .scale-fade-leave-active {
  }
  .scale-fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  .hline{
    position: fixed;
    top: 50%;
    left: 0;
    display: block;
    width: 100vw;
    height: 1px;
    background: #000;
    opacity: 0.3;
  }

  .vline{
    position: fixed;
    top: 0;
    left: 50%;
    display: block;
    width: 1px;
    height: 100vh;
    background: #000;
    opacity: 0.3;
  }

  .debug{
    position: absolute;
    right: 240px;
    bottom: 30px;
    z-index: 1;
    font-size: 14px;
    font-weight: bold;
  }

  .loader {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #fff;

    .ui {
      .text {
        margin: 9px 0 0 0;
        font-size: 24px;
        color: #333;
        text-align: center;
      }
    }
  }

  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -131px 0 0 -400px;
    pointer-events: none;
    img {
      width: 800px;
      height: auto;
    }
  }

  .canvas_container {
    height: 100vh;
    opacity: 0;

    &.home{
      background: linear-gradient(to bottom, #95fffa 10%, #ff5c8e 50%);
    }

    &.co2{
      background: linear-gradient(to bottom, #fa86fb 10%, #ecff82 30%, #43ff9c 50%);
    }

    &.walk{
      background: linear-gradient(to bottom, #00ff76 10%, #ecff82 30%, #ff9196 50%);
    }

    &.point{
      background: linear-gradient(to bottom, #00487e 10%, #00dbfc 30%, #a8feff 50%);
    }

    &.sdgs{
      background: linear-gradient(to bottom, #000 10%, #00487e 50%);
    }

    &.show {
      opacity: 1;
    }

    .texture_canvas {
      position: absolute;
      bottom: 80px;
      left: 0;
      z-index: 9999;
      display: none;
      // transform: scale(0.5);
      // transform-origin: 0 100%;
    }
  }
}

.dg.ac {
  top: 80px;
}
</style>
