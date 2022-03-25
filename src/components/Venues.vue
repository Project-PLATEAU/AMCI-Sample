<script lang="ts">
import Vue from 'vue'
import { eventStore } from '~/store'

export default Vue.extend({
  data() {
    return {
      actNames: [
        'サステナブル・フード',
        '気候変動と資源循環',
        'WELL-BEING',
        'ダイバーシティ＆インクルージョン',
        'コミュニケーション',
      ],
    }
  },

  computed: {
    venues() {
      return this.$amciData.venues
    },

    venuesLength(): number {
      return this.venues.length
    },

    venueName(): Function {
      return (venue: any) => (venue.name === 'オンライン' ? 'オンラインでのSDGs活動' : venue.name)
    },

    actVenues(): Function {
      return (actNumber: number) => this.venues.filter((venue) => venue.acts.includes(`ACT${actNumber}`))
    },
  },

  methods: {
    onClickVenue(venue: any, act: string) {
      eventStore.setVenue({})
      setTimeout(() => {
        eventStore.setVenue(venue)
        eventStore.setCurrentAct(act)
      })
    },
  },
})
</script>

<template lang="pug">
.venues
  section
    DataTitle 活動場所
    Data(:value="venuesLength" :animate="false")
    DataSpan
    Description リストから活動場所を選択すると3D都市モデル上に情報が表示されます。3D都市モデル上で選択して表示も可能です。
  template(v-for="i in 5")
    .venues-list-header(:class="`act${i}`")
      img(:src="require(`~/assets/images/act${i}.png`)" :srcset="require(`~/assets/images/act${i}.png`) + ' 1x, ' + require(`~/assets/images/act${i}@2x.png`) + ' 2x'")
      p ACT
        | {{ i }}
        br
        span {{ actNames[i - 1]}}
    ul.venues-list
      li.venues-list-item(v-for="(venue, index) in actVenues(i)" :key="index" @click="onClickVenue(venue, `ACT${i}`)") {{ venueName(venue) }}
        ul.sdg-list
          li.sdg(v-for="(sdg, index) in venue.actData[`ACT${i}`].sdgs" :key="index" :class="`sdg-${sdg}`")
</template>

<style lang="scss" scoped>
.venues {
  section {
    padding: 23px 30px 37px 30px;
  }

  .data {
    margin-bottom: -2px;
  }

  .data-span {
    margin-bottom: 30px;
  }

  .venues-list-header {
    display: flex;
    align-items: center;
    height: 60px;
    padding-left: 30px;
    background: #bdc3c7;

    img {
      width: 40px;
      height: 40px;
      margin-right: 9px;
    }

    p {
      font-size: 1.4rem;
      line-height: 1.3;
      color: $magenta;

      span {
        font-size: 2rem;
        color: #fff;
      }
    }
  }

  .venues-list {
    .venues-list-item {
      position: relative;
      height: 29px;
      padding-left: 30px;
      font-size: 1.4rem;
      line-height: 29px;
      cursor: pointer;

      &:not(:last-child) {
        border-bottom: 1px solid $base;
      }

      &:hover {
        color: #fff;
        background: $cyan;
      }

      .sdg-list {
        position: absolute;
        top: 50%;
        right: 20px;
        display: flex;
        transform: translateY(-50%);

        .sdg {
          width: 10px;
          height: 10px;
          margin-left: 10px;

          &.sdg-1 {
            background: sdg-color(1);
          }

          &.sdg-2 {
            background: sdg-color(2);
          }

          &.sdg-3 {
            background: sdg-color(3);
          }

          &.sdg-4 {
            background: sdg-color(4);
          }

          &.sdg-5 {
            background: sdg-color(5);
          }

          &.sdg-6 {
            background: sdg-color(6);
          }

          &.sdg-7 {
            background: sdg-color(7);
          }

          &.sdg-8 {
            background: sdg-color(8);
          }

          &.sdg-9 {
            background: sdg-color(9);
          }

          &.sdg-10 {
            background: sdg-color(10);
          }

          &.sdg-11 {
            background: sdg-color(11);
          }

          &.sdg-12 {
            background: sdg-color(12);
          }

          &.sdg-13 {
            background: sdg-color(13);
          }

          &.sdg-14 {
            background: sdg-color(14);
          }

          &.sdg-15 {
            background: sdg-color(15);
          }

          &.sdg-16 {
            background: sdg-color(16);
          }

          &.sdg-17 {
            background: sdg-color(17);
          }
        }
      }
    }
  }
}
</style>
