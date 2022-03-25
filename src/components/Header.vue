<script lang="ts">
import Vue from 'vue'
import { eventStore } from '~/store'

export default Vue.extend({
  computed: {
    currentContent() {
      return eventStore.currentContent
    },
  },

  mounted() {
  },

  methods: {
    onClickLogoButton() {
      eventStore.showContent('Home')
    },

    onClickAreaActivityButton() {
      eventStore.showContent('AreaActivity')
      eventStore.setSideBarActive(true)
    },

    onClickVenuesButton() {
      eventStore.setVenue({})
      setTimeout(() => {
        eventStore.showContent('Venues')
        eventStore.setSideBarActive(true)
      })
    },

    onClickSDGsActionsButton() {
      eventStore.showContent('SDGsActions')
      eventStore.setSideBarActive(true)
    },

    onClickJoinUsButton() {
      window.open('https://mb.act-5.jp/', '_blank')
    },

    onHoverButton(event: MouseEvent) {
      if (event.target instanceof HTMLDivElement && !event.target.classList.contains('selected')) {
      }
    },

  },
})
</script>

<template lang="pug">
header.header
  nav.nav
    .nav-left
      .nav-item.logo(@click="onClickLogoButton")
        Logo
      .nav-item.hoverable(
        @click="onClickAreaActivityButton" @mouseenter="onHoverButton" :class="{ selected: currentContent === 'AreaActivity' }")
        .content.ja まちの活動量
          span.en AREA ACTIVITY
        .content.hover.ja まちの活動量
          span.en AREA ACTIVITY
      .nav-item.hoverable(@click="onClickVenuesButton" @mouseenter="onHoverButton" :class="{ selected: currentContent === 'Venues' }")
        .content.ja 活動場所
          span.en VENUES
        .content.hover.ja 活動場所
          span.en VENUES
      .nav-item.hoverable(@click="onClickSDGsActionsButton" @mouseenter="onHoverButton" :class="{ selected: currentContent === 'SDGsActions' }")
        .content.ja SDGs活動の集積
          span.en SDGs ACTIONS
        .content.hover.ja SDGs活動の集積
          span.en SDGs ACTIONS
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  width: 100vw;
  height: 80px;
  pointer-events: all;

  .nav {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background: #fff;
    border-bottom: 1px solid $base;

    // common
    .nav-item {
      position: relative;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180px;
      overflow: hidden;
      cursor: pointer;

      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;

        &.ja {
          font-size: 1.6rem;
        }

        .en {
          display: block;
          font-size: 1rem;
        }
      }
    }

    .nav-left {
      display: flex;
      justify-content: flex-start;

      .nav-item {
        border-right: 1px solid $base;

        &.logo {
          width: 182px;
          padding-top: 8px;
        }
      }
    }

  }
}
</style>
