<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClickTabItem() {
    },

    onHoverButton(event: MouseEvent) {
      if (event.target instanceof HTMLLIElement && !event.target.classList.contains('selected')) {
      }
    },
  },
})
</script>

<template lang="pug">
li.tab-item.hoverable(:class="{ selected: selected }" @click="onClickTabItem" @mouseenter="onHoverButton")
  .content
    slot
  .content.hover
    slot
</template>

<style lang="scss" scoped>
.tab-item {
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.8rem;
  cursor: pointer;
  background: #fff;

  &:not(:last-child) {
    border-right: 1px solid $base;
  }

  /* &.selected {
    color: #fff;
    background: $cyan;
  } */

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  &.selected {
    .content {
      color: #fff;
    }

    &::before {
      height: 100%;
    }
  }
}
</style>
