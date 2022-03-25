<script lang="ts">
import Vue from 'vue'
import { Carousel, Slide } from 'vue-carousel'

export default Vue.extend({
  components: {
    Carousel,
    Slide,
  },

  data() {
    return {
      currentSlide: 0,
      defaultPage: [6, false],
    }
  },

  methods: {
    onPageChanged(page: number) {
      // @ts-ignore
      // this.$refs[`graph${page + 1}`].startAnimation()
      this.currentSlide = page
    },
  },
})
</script>

<template lang="pug">
.points
  section
    Description.description 大丸有SDGs ACT5を通して参加者が獲得したポイント数を表しています。3D都市モデル上では、大手町・丸の内・有楽町各エリアごとの獲得ポイント量が青い粒子として浮かび上がり、そこで活動する人々の滞留が黄色の粒子としてきらめいています。
    DataTitle.data-title 獲得ポイント総数
    .data-container
      .point-graph(:width="400" :height="400")
        PointCircle
      Data.data(:value="$amciData.totalPoints")
      p.total-data /1,000,000
  Divider.divier(:marginTop="40" :marginBottom="33")
  section
    DataTitle.data-title ACT5活動周辺のエリア人口と獲得ポイント数
    DataSpan.data-span(span="2021.5〜2021.11")
    Carousel.carousel(:perPage="1" paginationActiveColor="#463c64" paginationColor="#bdc3c7" :paginationPadding="15" @page-change="onPageChanged" :navigateTo="defaultPage")
      Slide.carousel-slide
        PointGraph(:month="5" ref="graph1" v-if="currentSlide === 0")
      Slide.carousel-slide
        PointGraph(:month="6" ref="graph2" v-if="currentSlide === 1")
      Slide.carousel-slide
        PointGraph(:month="7" ref="graph3" v-if="currentSlide === 2")
      Slide.carousel-slide
        PointGraph(:month="8" ref="graph4" v-if="currentSlide === 3")
      Slide.carousel-slide
        PointGraph(:month="9" ref="graph5" v-if="currentSlide === 4")
      Slide.carousel-slide
        PointGraph(:month="10" ref="graph6" v-if="currentSlide === 5")
      Slide.carousel-slide
        PointGraph(:month="11" ref="graph7" v-if="currentSlide === 6")
    Caption エリア人口は、取得した人流データをもとに期間中の日別最大エリア人口を100とした比率で表示しています。
</template>

<style lang="scss" scoped>
.points {
  .description {
    margin-bottom: 48px;
  }

  .data-title {
    margin-bottom: 13px;
  }

  .data-container {
    position: relative;

    .point-graph {
      width: 400px;
      height: 400px;
      margin: 0 auto;
    }

    .data {
      position: absolute;
      top: 143px;
      left: 50%;
      transform: translateX(-50%);
    }

    .total-data {
      position: absolute;
      top: 218px;
      left: 50%;
      font-size: 3rem;
      letter-spacing: 0.05em;
      transform: translateX(-50%);
    }
  }

  section:nth-of-type(1) {
  }

  section:nth-of-type(2) {
    .data-title {
      margin-bottom: 2px;
    }

    .data-span {
      margin-bottom: 35px;
    }

    .caption {
      margin-top: 9px;
    }
  }

  .carousel {
    margin: 0 -10px 0 -10px;

    .carousel-slide {
      padding: 0 10px;
    }

    .VueCarousel-wrapper {
      margin-bottom: 10px;
    }
  }
}
</style>
