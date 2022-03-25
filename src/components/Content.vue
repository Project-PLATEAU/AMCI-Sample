<script lang="ts">
import Vue from 'vue'
import { eventStore } from '~/store'
import ArrowLeftIcon from '~/assets/images/arrow_left.svg?inline'

export default Vue.extend({
  components: {
    ArrowLeftIcon,
  },

  computed: {
    isContentActive() {
      return eventStore.currentContent !== 'Home'
    },

    isSideBarActive() {
      return eventStore.isSideBarActive
    },

    currentContent() {
      return eventStore.currentContent
    },
  },

  watch: {
    currentContent(newValue) {
      if (newValue !== 'Home' && this.$refs.content instanceof HTMLDivElement) {
        this.$refs.content.scrollTop = 0
      }
    },
  },

  methods: {
    onClickCloseButton() {
      // eventStore.hideContent()
      eventStore.toggleSideBar()
    },
  },
})
</script>

<template lang="pug">
transition(name="content" appear)
  main.main(v-if="isContentActive" :class="{ 'sidebar-inactive': !isSideBarActive }")
    .content(ref="content")
      template(v-if="currentContent === 'AreaActivity'")
        AreaActivity
      template(v-else-if="currentContent === 'Venues'")
        Venues
      template(v-else-if="currentContent === 'SDGsActions'")
        SDGsActions
    .close-button(@click="onClickCloseButton")
      ArrowLeftIcon
</template>

<style lang="scss" scoped>
.main {
  position: absolute;
  top: 80px;
  left: 0;
  width: 604px;
  height: calc(100vh - 80px);
  pointer-events: all;
  background: #fff;
  border-right: 1px solid $base;
  transition: transform $fade-duration cubic-bezier(0, 0, 0.2, 1) 0ms;
  transform: translateX(0);

  .content {
    height: 100%;
    overflow-y: scroll;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: -32px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding-right: 2px;
    cursor: pointer;
    background: #fff;
    border-right: 1px solid $base;
    border-bottom: 1px solid $base;
    border-left: 1px solid $base;
    transition: background $hover-duration, transform $fade-duration cubic-bezier(0, 0, 0.2, 1) 0ms;

    svg {
      width: 19px;
      height: auto;
    }

    &:hover {
      background: $cyan;

      .icon {
        stroke: #fff;
      }
    }
  }

  &.sidebar-inactive {
    transform: translateX(-100%);

    .close-button {
      transform: scaleX(-1);
    }
  }
}

.content-enter-active,
.content-leave-active {
  transition: transform $fade-duration cubic-bezier(0, 0, 0.2, 1) 0ms;
  transform: translateX(0);
}

.content-enter,
.content-leave-to {
  transform: translateX(-636px);
}
</style>
