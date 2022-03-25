<script lang="ts">
import Vue from 'vue'
import { gsap, Elastic } from 'gsap'
import { eventStore } from '~/store'
import Act1Icon from '~/assets/images/act1.svg?inline'
import Act2Icon from '~/assets/images/act2.svg?inline'
import Act3Icon from '~/assets/images/act3.svg?inline'
import Act4Icon from '~/assets/images/act4.svg?inline'
import Act5Icon from '~/assets/images/act5.svg?inline'
import CloseIcon from '~/assets/images/close.svg?inline'

export default Vue.extend({
  components: {
    Act1Icon,
    Act2Icon,
    Act3Icon,
    Act4Icon,
    Act5Icon,
    CloseIcon,
  },

  data() {
    return {
      currentAct: '',
      dataAnimationDelay: 1000,
    }
  },

  computed: {
    isCurrentContentVenue(): boolean {
      return eventStore.currentContent === 'Venues'
    },

    currentVenue(): any {
      return eventStore.currentVenue
    },

    selectedAct(): string {
      return eventStore.currentAct
    },

    hasCurrentVenue(): boolean {
      return Object.keys(this.currentVenue).length > 0
    },

    needsShow(): boolean {
      return this.hasCurrentVenue && this.isCurrentContentVenue
    },

    hasAct1(): boolean {
      return this.currentVenue.acts.includes('ACT1')
    },

    hasAct2(): boolean {
      return this.currentVenue.acts.includes('ACT2')
    },

    hasAct3(): boolean {
      return this.currentVenue.acts.includes('ACT3')
    },

    hasAct4(): boolean {
      return this.currentVenue.acts.includes('ACT4')
    },

    hasAct5(): boolean {
      return this.currentVenue.acts.includes('ACT5')
    },

    venueName(): Function {
      return (venue: any) => (venue.name === 'オンライン' ? 'オンラインでのSDGs活動' : venue.name)
    },
  },

  watch: {
    currentVenue(venue) {
      this.dataAnimationDelay = 1000

      if (Object.keys(venue).length > 0 && venue.acts) {
        if (venue.acts.includes(this.selectedAct)) {
          this.currentAct = this.selectedAct
        } else if (venue.acts.length > 0) {
          this.currentAct = venue.acts[0]
        }
      }
    },
  },

  methods: {
    actData(act: string): any {
      return this.currentVenue.actData[`${act}`]
    },

    actPoint(act: string) {
      const point = this.actData(act).point
      if (point === 0) {
        return -1
      }
      return point
    },

    isStarbucks() {
      return this.currentVenue.name.includes('スターバックス')
    },

    onClickActTab(act: string) {
      this.currentAct = act
      this.dataAnimationDelay = 0
    },

    onClickCloseButton() {
      eventStore.setVenue({})
    },

    showModal(el: HTMLDivElement, done: gsap.Callback) {
      const tl = gsap.timeline({
        delay: 0.9,
        onComplete: done,
      })
      gsap.set(el, {
        scale: 0.96,
        opacity: 0,
      })
      tl.to(el, {
        duration: 0.2,
        opacity: 1,
      })
      tl.to(
        el,
        {
          duration: 0.6,
          scale: 1,
          ease: Elastic.easeOut,
        },
        '<'
      )
    },

    hideModal(el: HTMLDivElement, done: gsap.Callback) {
      const tl = gsap.timeline({
        onComplete: done,
      })
      tl.to(el, {
        duration: 0.2,
        opacity: 0,
      })
      tl.to(
        el,
        {
          duration: 0.5,
          scale: 0.96,
          ease: Elastic.easeOut,
        },
        '<'
      )
    },
  },
})
</script>

<template lang="pug">
.modal-venue
  //- transition(name="indicator" appear)
    .indicator(v-if="needsShow")
  transition(v-on:enter="showModal" v-on:leave="hideModal")
    .content(v-if="needsShow")
      .act-tabs
        .act-tab-item.act1(
          @click="onClickActTab('ACT1')"
          :class="{ selected: currentAct === 'ACT1', disabled: !hasAct1 }")
          Act1Icon
          span ACT1
        .act-tab-item.act2(
          @click="onClickActTab('ACT2')"
          :class="{ selected: currentAct === 'ACT2', disabled: !hasAct2 }")
          Act2Icon
          span ACT2
        .act-tab-item.act3(
          @click="onClickActTab('ACT3')"
          :class="{ selected: currentAct === 'ACT3', disabled: !hasAct3 }")
          Act3Icon
          span ACT3
        .act-tab-item.act4(
          @click="onClickActTab('ACT4')"
          :class="{ selected: currentAct === 'ACT4', disabled: !hasAct4 }")
          Act4Icon
          span ACT4
        .act-tab-item.act5(
          @click="onClickActTab('ACT5')"
          :class="{ selected: currentAct === 'ACT5', disabled: !hasAct5 }")
          Act5Icon
          span ACT5
      .venue-name {{ venueName(currentVenue) }}
      .venue-address {{ currentVenue.address === '-' ? '&nbsp;' : `${currentVenue.address} ${currentVenue.building}` }}
      Divider(:marginTop="27" :marginBottom="8")
      .info(v-if="actData(currentAct)")
        .info-left
          .info-title ■SDGs
          .sdg-images
            img(v-for="sdg in actData(currentAct).sdgs" :key="sdg" :src="require(`~/assets/images/sdg_${String(sdg).padStart(2, '0')}.png`)" :srcset="require(`~/assets/images/sdg_${String(sdg).padStart(2, '0')}.png`) + ' 1x, ' + require(`~/assets/images/sdg_${String(sdg).padStart(2, '0')}@2x.png`) + ' 2x'")
          template(v-if="!isStarbucks()")
            .info-title ■獲得ポイント
            Data.point(:value="actPoint(currentAct)" :key="actPoint(currentAct)" :delay="dataAnimationDelay")
              span pt
        .info-right
          .info-title ■活動
          ul
            li(v-for="title in actData(currentAct).titles")
              a(:href="title.link" target="_blank" v-if="title.link") {{ title.name }}
              span(v-else) {{ title.name }}
      .close-button(@click="onClickCloseButton")
        CloseIcon
</template>

<style lang="scss" scoped>
$transition-delay: 0.12s;

.modal-venue {
  position: absolute;
  bottom: calc(50% - 40px);
  left: calc(50% + 302px);
  z-index: 1;
  width: 500px;
  transform: translateX(-50%);
  transform-origin: 400px 0;
}

.content {
  width: 100%;
  pointer-events: all;
  background: #fff;
  border: 1px solid $base;

  .act-tabs {
    position: absolute;
    top: -33px;
    left: -1px;
    display: flex;
    flex-direction: row;
    width: calc(100% + 2px);
    height: 32px;
    background: #fff;
    border-top: 1px solid $base;
    border-right: 1px solid $base;
    border-left: 1px solid $base;

    .act-tab-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25%;
      cursor: pointer;
      transition: background $hover-duration;

      span {
        margin-top: -2px;
        margin-left: 8px;
        font-size: 1.8rem;
        line-height: 1;
        letter-spacing: 0.05em;
      }

      svg {
        height: auto;
        transition: fill $hover-duration;

        .icon {
          fill: $magenta;
          stroke: none;
        }
      }

      &.act1 svg {
        width: 26px;
      }

      &.act2 svg {
        width: 20px;
      }

      &.act3 svg {
        width: 20px;
      }

      &.act4 svg {
        width: 18px;
      }

      &.act5 svg {
        width: 18px;
      }

      &:not(:last-child) {
        border-right: 1px solid $base;
      }

      &.selected,
      &:hover {
        color: #fff;
        background: $magenta;

        .icon {
          fill: #fff;
        }
      }

      &.disabled {
        color: $gray;
        pointer-events: none;

        .icon {
          fill: $gray;
        }
      }
    }
  }

  .venue-name {
    padding: 23px 28px 0;
    font-size: 2.4rem;
    letter-spacing: 0.05em;
  }

  .venue-address {
    padding: 1px 0 0 29px;
    font-size: 1rem;
    letter-spacing: 0.05em;
  }

  .info {
    display: flex;
    padding: 20px 0 25px 31px;
    font-size: 1.4rem;
    letter-spacing: 0.05em;

    .info-left {
      flex: 1;

      .sdg-images {
        max-width: 200px;
        height: 50px;
        margin-top: 4px;
        margin-bottom: 13px;
        line-height: 0;

        img {
          width: 25px;
          height: 25px;
        }
      }

      .point {
        padding-left: 0;
        margin-top: -3px;
        font-size: 2.4rem;
        text-align: left;

        span {
          font-size: 2.4rem;
        }
      }
    }

    .info-right {
      width: 212px;
      padding-right: 10px;

      ul {
        padding-left: 4px;
      }

      li {
        list-style-type: '・';
      }

      a {
        color: $base;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  .close-button {
    position: absolute;
    top: -1px;
    right: -33px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding-left: 1px;
    cursor: pointer;
    background: #fff;
    border-top: 1px solid $base;
    border-right: 1px solid $base;
    border-bottom: 1px solid $base;
    transition: background $hover-duration, stroke $hover-duration;

    svg {
      width: 15px;
      height: 15px;
    }

    &:hover {
      background: $cyan;

      .icon {
        stroke: #fff;
      }
    }
  }
}

.indicator {
  position: absolute;
  bottom: -100px;
  left: 50%;
  z-index: -1;
  width: 1px;
  height: 100px;
  background: $base;

  &::after {
    position: absolute;
    bottom: -10px;
    left: -10px;
    width: 20px;
    height: 20px;
    content: '';
    background: $cyan;
    border: 1px solid $base;
    border-radius: 10px;
  }
}

.modal-venue-enter-active {
  transition: opacity $fade-duration $transition-delay + $fade-duration * 1.5;
}

.indicator-enter-active {
  transition: height $fade-duration $transition-delay + $fade-duration, opacity $fade-duration $transition-delay;
}

.modal-venue-leave-active,
.indicator-leave-active {
  transition: opacity $fade-duration;
}

.modal-venue-enter,
.modal-venue-leave-to,
.indicator-leave-to {
  opacity: 0;
}

.indicator-enter {
  height: 0;
  opacity: 0;
}

.indicator-enter-to {
  height: 100px;
}
</style>
