<script lang="ts">
import Vue from 'vue'
import { eventStore } from '~/store'

export default Vue.extend({
  computed: {
    currentTab() {
      return eventStore.currentAreaActivityTab
    },

    isCurrentTabCo2Reducations(): Boolean {
      return this.currentTab === 'Co2Reducations'
    },

    isCurrentTabWalks(): Boolean {
      return this.currentTab === 'Walks'
    },

    isCurrentTabPoints(): Boolean {
      return this.currentTab === 'Points'
    },
  },

  created() {
    eventStore.setAreaActivityTab('Co2Reducations')
  },

  destroyed() {
    eventStore.setAreaActivityTab(null)
  },

  methods: {
    onClickCo2ReducationsButton() {
      eventStore.setAreaActivityTab('Co2Reducations')
    },

    onClickWalksButton() {
      eventStore.setAreaActivityTab('Walks')
    },

    onClickPointsButton() {
      eventStore.setAreaActivityTab('Points')
    },
  },
})
</script>

<template lang="pug">
.area-activity
  Tabs(:tabSize="3")
    TabItem(@click.native="onClickCo2ReducationsButton" :selected="isCurrentTabCo2Reducations") CO2排出削減量
    TabItem(@click.native="onClickWalksButton" :selected="isCurrentTabWalks") 歩数
    TabItem(@click.native="onClickPointsButton" :selected="isCurrentTabPoints") ポイント数
  template(v-if="isCurrentTabCo2Reducations")
    Co2Reducations
  template(v-else-if="isCurrentTabWalks")
    Walks
  template(v-else-if="isCurrentTabPoints")
    Points
</template>

<style lang="scss" scoped>
.area-activity {
  padding: 30px 29px 30px 30px;

  .tabs {
    margin-bottom: 34px;
  }
}
</style>
