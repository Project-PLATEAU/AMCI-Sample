<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 0,
    },

    base: {
      type: Number,
      default: 1,
    },

    animate: {
      type: Boolean,
      default: true,
    },

    delay: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      text: '',
      outputText: '',
      originalLength: 0,
      length: 0,
      shuffleLength: 0,
      startTime: 0,
      timeOut: 20,
      randomNums: '0123456789',
    }
  },

  computed: {
    originalText(): string {
      return (Math.round(this.value * this.base) / this.base).toLocaleString()
    },
  },

  mounted() {
    if (this.value < 0) {
      this.outputText = '-'
    } else if (this.animate) {
      this.startTime = new Date().getTime() + this.delay
      this.originalLength = this.originalText.length
      this.init()
      this.update()
    } else {
      this.outputText = this.originalText
    }
  },

  methods: {
    init() {
      this.text = ''
      this.length = 0
      this.shuffleLength = 0
    },

    update() {
      if (this.length > this.originalLength) {
        return
      }
      const currentTime = new Date().getTime()
      if (currentTime - this.startTime > this.timeOut) {
        this.startTime = currentTime
        if (this.text.length < this.originalLength) {
          this.text = this.generateRandomText(this.shuffleLength) + this.text.slice(this.shuffleLength)
          if (this.shuffleLength < this.originalLength) this.shuffleLength++
        }
        if (this.shuffleLength > this.originalLength / 2) {
          this.text = this.originalText.slice(0, this.length) + this.text.slice(this.length)
          this.length++
        }
      }
      this.outputText = this.text
      window.requestAnimationFrame(() => {
        this.update()
      })
    },

    generateRandomText(length: number) {
      let randomText = ''
      for (let i = 0; i < length; i++) {
        randomText += this.randomNums[Math.floor(Math.random() * this.randomNums.length)]
      }
      return randomText
    },
  },
})
</script>

<template lang="pug">
.data {{ outputText }}
  slot
</template>

<style lang="scss" scoped>
.data {
  padding-left: 2px;
  margin-top: -9px;
  font-size: 6rem;
  text-align: center;
  letter-spacing: 0.05em;

  span {
    font-size: 3rem;
  }
}
</style>
