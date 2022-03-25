<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'

export default Vue.extend({
  props: {
    span: {
      type: String,
      default: null,
    },
  },

  computed: {
    dataSpan() {
      return `${dayjs(this.$amciData.firstDate).format('YYYY.M')}〜${dayjs(this.$amciData.lastDate).format('YYYY.M')}`
    },
  },
})
</script>

<template lang="pug">
.data-span {{ span ? span : dataSpan }}
</template>

<style lang="scss" scoped>
.data-span {
  font-size: 1rem;
  text-align: center;
  letter-spacing: 0.05em;
}
</style>
