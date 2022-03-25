<script lang="ts">
import Vue from 'vue'
import { eventStore } from '~/store'

export default Vue.extend({
  data() {
    return {}
  },

  computed: {
    currentTab() {
      return eventStore.currentSDGsActionsTab
    },

    isCurrentTabAll(): Boolean {
      return this.currentTab === 'All'
    },

    isCurrentTabOtemachi(): Boolean {
      return this.currentTab === 'Otemachi'
    },

    isCurrentTabMarunouchi(): Boolean {
      return this.currentTab === 'Marunouchi'
    },

    isCurrentTabYurakucho(): Boolean {
      return this.currentTab === 'Yurakucho'
    },

    areaName(): string {
      if (this.isCurrentTabAll) {
        return '（エリア全体）'
      } else if (this.isCurrentTabOtemachi) {
        return '（大手町）'
      } else if (this.isCurrentTabMarunouchi) {
        return '（丸の内）'
      } else if (this.isCurrentTabYurakucho) {
        return '（有楽町）'
      }
      return ''
    },

    valuesData() {
      // @ts-ignore
      return this.$amciData.sdgData[`${this.currentTab}`].values
    },

    percentsData() {
      // @ts-ignore
      return this.$amciData.sdgData[`${this.currentTab}`].percents
    },

    barGraphHeight() {
      // @ts-ignore
      return 50 * Object.values(this.valuesData).filter((data) => data !== 0).length
    },
  },

  created() {
    eventStore.setSDGsActionsTab('All')
  },

  destroyed() {
    eventStore.setSDGsActionsTab(null)
  },

  methods: {
    onClickAllButton() {
      eventStore.setSDGsActionsTab('All')
    },

    onClickOtemachiButton() {
      eventStore.setSDGsActionsTab('Otemachi')
    },

    onClickMarunouchiButton() {
      eventStore.setSDGsActionsTab('Marunouchi')
    },

    onClickYurakuchoButton() {
      eventStore.setSDGsActionsTab('Yurakucho')
    },
  },
})
</script>

<template lang="pug">
.sdgs-actions
  Tabs(:tabSize="4")
    TabItem(@click.native="onClickAllButton" :selected="isCurrentTabAll") ALL
    TabItem(@click.native="onClickOtemachiButton" :selected="isCurrentTabOtemachi") 大手町
    TabItem(@click.native="onClickMarunouchiButton" :selected="isCurrentTabMarunouchi") 丸の内
    TabItem(@click.native="onClickYurakuchoButton" :selected="isCurrentTabYurakucho") 有楽町
  .container
    section
      DataTitle SDGs活動の集積
      Description 大丸有エリアのSDGs活動の集積を17の目標別に表現しています。3D都市モデル上では活動の集積が、まちをキャンパスとした17の彩りとして表現されます。エリア全体(ALL)に加え、大手町・丸の内・有楽町それぞれのエリアで選択して表示が可能です。
      .sdg-images
        img(v-for="i in 17" :key="i" :src="require(`~/assets/images/sdg_${String(i).padStart(2, '0')}.png`)" :srcset="require(`~/assets/images/sdg_${String(i).padStart(2, '0')}.png`) + ' 1x, ' + require(`~/assets/images/sdg_${String(i).padStart(2, '0')}@2x.png`) + ' 2x'")
    Divider(:marginTop="43" :marginBottom="36")
    section
      DataTitle SDGs活動の集積
        br
        span {{ areaName }}
      .sdg-graph
        SdgGraph(:width="400" :height="400" :dataset="percentsData" :key="currentTab")
      Divider(:marginTop="43" :marginBottom="36")
      DataTitle 活動別ポイント累積数
        br
        span {{ areaName }}
      .sdg-bar-graph
        SdgBarGraph(:width="524" :height="barGraphHeight" :dataset="valuesData" :key="currentTab")
      Caption 大手町・丸の内・有楽町エリアそれぞれの活動の集積は、各エリアに勤務する参加者が獲得したポイントに基づきます。“エリア全体”には大丸有エリア以外の勤務者も含みます。<br>SDGs活動の集積＝活動毎に紐づけられた17の目標による分類 × 活動毎の獲得ポイント数
</template>

<style lang="scss" scoped>
.sdgs-actions {
  padding: 30px;

  .tabs {
    margin-bottom: 34px;
  }

  .data-title {
    margin-bottom: 6px;
  }

  .description {
    margin-bottom: 35px;
  }

  .sdg-images {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-right: -1px;
    margin-left: -1px;
  }

  section:nth-of-type(2) {
    .data-title {
      margin-bottom: 18px;
      line-height: 1.25;
    }
  }

  .sdg-graph {
    width: 400px;
    height: 400px;
    margin: 0 auto;
    margin-bottom: 40px;
  }

  .sdg-bar-graph {
    width: 524px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
</style>
